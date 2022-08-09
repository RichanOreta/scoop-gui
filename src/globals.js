import fs from 'fs'
import fuzzysort from 'fuzzysort';
import os from 'os'
import { exec } from 'child_process'

const user = os.homedir()
const path = user + '/scoop'
const { shell } = require('electron')

let $bucketFiles = {};
let $buckets = [];
let $installedApps = [];
let $appsToUpdate = [];
let $searchResults = [];
let $knownBuckets = [];
let $commandOutput = '';


function isPositiveInteger(x) {
    // http://stackoverflow.com/a/1019526/11236
    return /^\d+$/.test(x);
}

/**
 * Compare two software version numbers (e.g. 1.7.1)
 * Returns:
 *
 *  0 if they're identical
 *  negative if v1 < v2
 *  positive if v1 > v2
 *  Nan if they in the wrong format
 *
 *  E.g.:
 *
 *  assert(version_number_compare("1.7.1", "1.6.10") > 0);
 *  assert(version_number_compare("1.7.1", "1.7.10") < 0);
 *
 *  "Unit tests": http://jsfiddle.net/ripper234/Xv9WL/28/
 *
 *  Taken from http://stackoverflow.com/a/6832721/11236
 */
function compareVersionNumbers(v1, v2){
    var v1parts = v1.split('.');
    var v2parts = v2.split('.');

    // First, validate both numbers are true version numbers
    function validateParts(parts) {
        for (var i = 0; i < parts.length; ++i) {
            if (!isPositiveInteger(parts[i])) {
                return false;
            }
        }
        return true;
    }
    if (!validateParts(v1parts) || !validateParts(v2parts)) {
        return NaN;
    }

    for (var i = 0; i < v1parts.length; ++i) {
        if (v2parts.length === i) {
            return 1;
        }

        if (v1parts[i] === v2parts[i]) {
            continue;
        }
        if (v1parts[i] > v2parts[i]) {
            return 1;
        }
        return -1;
    }

    if (v1parts.length != v2parts.length) {
        return -1;
    }

    return 0;
}



export function update() {
	$bucketFiles = {};
	$buckets = [];
	$installedApps = [];
	$appsToUpdate = [];
	$knownBuckets = [];

	fs.readdirSync(path + '/apps').forEach(file => {
		if (file != 'scoop') {
			const appData = fs.readFileSync(path + '/apps/' + file.replace('.json', '') + '/current/manifest.json')
			const jsonAppData = JSON.parse(appData)

			$installedApps.push({
				'appName': file.replace('.json', ''),
				'appVersion': jsonAppData.version,
				'appDescription': jsonAppData.description,
				'appState': 'installed',
				'homepage': jsonAppData.homepage
			})
		}
	})

	fs.readdirSync(path + '/buckets').forEach(bucket => {
		let tempList = []
		let isInstalled = []

		fs.readdirSync(path + '/buckets/' + bucket + '/bucket').forEach(file => {
			const appData = fs.readFileSync(path + '/buckets/' + bucket + '/bucket/' + file)
			const jsonAppData = JSON.parse(appData)

			for (let i = 0; i < $installedApps.length; i++) {
				if ($installedApps[i]['appName'] == file.replace('.json', '')) {
					isInstalled = 'installed'
					break
				} else {
					isInstalled = 'not installed'
				}
			}

			tempList.push({
				'appName': file.replace('.json', ''),
				'appVersion': jsonAppData.version,
				'appDescription': jsonAppData.description,
				'appState': isInstalled,
				'homepage': jsonAppData.homepage
			})
		})
		$bucketFiles[bucket] = tempList
		$buckets.push(bucket)
	})

	for (let key in JSON.parse(fs.readFileSync(path + '/apps/scoop/current/buckets.json'))) {
		let bucketEntry = {
			'bucketName': key,
			'isAdded': 'not added'
		}

		if ($buckets.includes(key)) {
			bucketEntry['isAdded'] = 'added'
		}

		if (bucketEntry['isAdded'] == 'not added') {
			$knownBuckets.splice(0, 0, bucketEntry)
		} else {
			$knownBuckets.push(bucketEntry)
		}
	}


	let appsChecked = []
	let tempList = []
    for (let key in $bucketFiles) {
		$bucketFiles[key].forEach(item => {
			$installedApps.forEach(appInfo => {
				if (appsChecked.includes(appInfo['appName']) == false) {
					const appVersion = appInfo['appVersion'].split('.').length == 2 ? appInfo['appVersion'] + '.0' : appInfo['appVersion']
					const itemVersion = item['appVersion'].split('.').length == 2 ? item['appVersion'] + '.0' : item['appVersion']

					if (appInfo['appName'] == item['appName'] && compareVersionNumbers(appVersion, itemVersion) == -1) {
						appsChecked.push(appInfo['appName'])
						tempList.push({
							'appName': appInfo['appName'],
							'appVersion': appVersion + ' <i class="fa-solid fa-right-long"></i> ' + itemVersion, 
							'appDescription': appInfo['appDescription'],
							'appState': 'outdated',
							'homepage': appInfo['homepage']
						})
					}
				}
			})
		})
	}

	appsChecked.sort()
	for (let i = 0; i < appsChecked.length; i++) {
		for (let key in tempList) {
			if (tempList[key]['appName'] == appsChecked[i]) {
				$appsToUpdate.push(tempList[key])
			}
		}
	}
}

export function searchApp(appName) {
	$searchResults = []
	let fuzzysortOnlyResults = []
	const openingTag = /<b>/g
	const closingTag = /<\/b>/g

	for (let key in $bucketFiles) {
		$bucketFiles[key].forEach(appInfo => {
			const res = fuzzysort.go(appName, [appInfo['appName']])

			if (res.length > 0 && res[0]['target'].search(appName) != -1) {
				$searchResults.push({
					'appName': fuzzysort.highlight(res[0]).replace(openingTag, '<mark>').replace(closingTag, '</mark>'),
					'appVersion': appInfo['appVersion'],
					'appDescription': appInfo['appDescription'],
					'appState': appInfo['appState'],
					'homepage': appInfo['homepage']
				})
			} else if (res.length > 0) {
				fuzzysortOnlyResults.push({
					'appName': fuzzysort.highlight(res[0]).replace(openingTag, '<mark>').replace(closingTag, '</mark>'),
					'appVersion': appInfo['appVersion'],
					'appDescription': appInfo['appDescription'],
					'appState': appInfo['appState'],
					'homepage': appInfo['homepage']
				})
			}
		});
	}

	if ($searchResults.length == 0) {
		$searchResults = fuzzysortOnlyResults
	}
}

export function execute(command, callback){
	exec(command, function(error, stdout, stderr){
		if ($commandOutput.length == 0) {
			$commandOutput = stdout
		} else {
			$commandOutput = $commandOutput + '<br>' + stdout
		}

		$commandOutput = $commandOutput.replaceAll('\n', '<br>')
		update();
		callback(stdout);
	});
};

export function clearCommandOutput() {
	$commandOutput = ''
}

export function openLink(link) {
	shell.openExternal(link)
}

update()

export {
	$bucketFiles,
	$buckets,
	$installedApps,
	$appsToUpdate,
	$searchResults,
	$knownBuckets,
	$commandOutput
}
