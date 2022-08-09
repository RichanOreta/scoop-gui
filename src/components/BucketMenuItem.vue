<template>
	<button v-for="bucket in buckets" class="list-group-item list-group-item-action" :class="[bucket['isAdded'] == 'added' ? 'disabled text-secondary' : 'text-white']" id="bucket-item" @click="this.$emit('addBucket', bucket['bucketName'], '')">
		<i v-if="bucket['isAdded'] == 'not added'" class="fa-solid fa-plus"></i>
		<i v-else class="fa-solid fa-minus"></i>
		{{bucket['bucketName']}} ({{bucket['isAdded']}})
	</button>
</template>

<script>
export default {
	name: 'bucketMenuitem',
	emits: ['addBucket'],
	props: {
		buckets: Array
	}
}
</script>

<style></style>