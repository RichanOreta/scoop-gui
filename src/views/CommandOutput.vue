<template>
	<div class="position-relative">
		<button class="btn btn-outline-secondary me-2 position-sticky top-2 float-end" style="width: 5rem; top: 8px;" @click="clearOutput">Clear</button>
		<h6 class="text-light p-3">
			<span v-html="commandOutput"></span>
		</h6>
	</div>
</template>

<script>
import { $commandOutput, clearCommandOutput } from '@/globals'

export default {
	name: 'commandOutput',
	data() {
		return {
			commandOutput: $commandOutput
		}
	},
	methods: {
		setCommandOutput() {
			this.commandOutput = $commandOutput
		},
		clearOutput() {
			clearCommandOutput()
			this.setCommandOutput()
		}
	},
	mounted() {
		setInterval(() => {
			this.setCommandOutput()
		}, 1000)
	}
}
</script>

<style scoped>
	div {
		overflow-y: scroll;
		height: 91.5vh;
	}

	::-webkit-scrollbar {
		width: 10px;
	}

	::-webkit-scrollbar-track {
		background: transparent; 
	}

	::-webkit-scrollbar-thumb {
		background: #888; 
	}

	::-webkit-scrollbar-thumb:hover {
		background: #555; 
	}
</style>