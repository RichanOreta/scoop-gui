<template>
	<li v-for="(bucket, index) in buckets" type="button" class="list-group-item list-group-item-action text-center p-0" :class="[activeBucket == bucket ? 'activeBucket' : '']" id="bucket-item">
		<div class="row m-0">
			<div class="col-9 pe-0">
				<button class="text-white w-100 h-100 fs-5 py-2" style="background-color:transparent; border: 0; padding: 0;" @click="this.$emit('toggleActiveBucket', bucket)">{{bucket}}</button>
			</div>
			<div class="col-3 px-0">
				<button class="btn-close btn-close-white p-0 h-100 fs-4" aria-label="Close" @click="this.$emit('removeBucket', index)"></button>
			</div>
		</div>
	</li>
</template>

<script>
export default {
	name: 'bucketListItem',
	emits: ['toggleActiveBucket', 'removeBucket'],
	props: {
		activeBucket: String,
		buckets: Array
	}
}
</script>