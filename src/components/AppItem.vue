<template>
	<li class="list-group-item text-white border border-secondary" style="background-color: #2c2f35;">
		<div class="row">
			<div class="col">
				<h5 class="fs-5"><span v-html="appName"></span> (<span v-html="appVersion"></span>)</h5>
			</div>
			<div class="col-4">
				<button class="btn btn-primary float-end" v-if="appState == 'not installed'" @click="installApp">Install</button>
				<div class="dropdown" v-else-if="appState == 'installed with persist'">
					<button class="btn btn-danger dropdown-toggle float-end" type="button" data-bs-toggle="dropdown" aria-expanded="false">Uninstall</button>
					<ul class="dropdown-menu dropdown-menu-dark">
						<li><button class="dropdown-item" @click="uninstallApp">Uninstall</button></li>
						<li><button class="dropdown-item" @click="uninstallAndPurgeApp">Uninstall and purge</button></li>
					</ul>
				</div>
				<button class="btn btn-danger float-end" v-else-if="appState == 'installed'" @click="uninstallApp">Uninstall</button>
				<button class="btn btn-success float-end" v-else-if="appState == 'outdated'" @click="updateApp">Update</button>
			</div>
		</div>
		<div class="row">
			<div class="col">
				<p class="pt-2">{{appDescription}}</p>
				<a href="#" class="link-info text-break" @click="goToLink(homepage)">{{homepage}}</a>
			</div>
		</div>
	</li>
</template>

<script>
import { execute, openLink } from '@/globals';

export default {
	name: 'AppItem',
	emits: ['updateData'],
	data() {
		return {
			installedApps: [],
		}
	},
	props: {
		appName: String,
		appVersion: String,
		appDescription: String,
		appState: String,
		homepage: String
	},
	methods: {
		installApp() {
			execute('scoop install ' + this.appName.replace('<mark>', '').replace('</mark>', ''), (out) => {
				this.$emit('updateData')
			})
		},
		uninstallApp() {
			execute('scoop uninstall ' + this.appName.replace('<mark>', '').replace('</mark>', ''), (out) => {
				this.$emit('updateData')
			})
		},
		uninstallAndPurgeApp() {
			execute('scoop uninstall ' + this.appName.replace('<mark>', '').replace('</mark>', '') + ' --purge', (out) => {
				this.$emit('updateData')
			})
		},
		updateApp() {
			execute('scoop update ' + this.appName.replace('<mark>', '').replace('</mark>', ''), (out) => {
				this.$emit('updateData')
			})
		},
		goToLink(link) {
			openLink(link)
		}
	}
}
</script>

<style>
	li {
		background-color: #2c2f35;
	}

	button {
		width: 45%
	}
</style>