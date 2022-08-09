<template>
	<div class="d-flex justify-content-center mb-2 border-bottom border-2 border-secondary pb-2 mb-2">
		<a type="button" class="border-bottom border-2 p-1 px-2 me-1 fs-6" :class="[activeMenu == 'add-custom-bucket' ? activeClass : inactiveClass]" @click="toggleActiveMenu('add-custom-bucket')">Add custom bucket</a>
		<a type="button" class="border-bottom border-2 p-1 px-2 ms-1 fs-6" :class="[activeMenu == 'add-known-bucket' ? activeClass : inactiveClass]" @click="toggleActiveMenu('add-known-bucket')">Add known bucket</a>
	</div>
	<div v-if="activeMenu == 'add-custom-bucket'">
		<div class="input-group mb-2 pb-2 border-bottom border-2 border-secondary">
			<div class="row w-100 m-0 mb-1">
				<input v-model="bucketName" type="text" class="form-control bg-dark border-secondary text-light" placeholder="Bucket Name">
			</div>
			<div class="row w-100 m-0 mb-1">
				<input v-model="bucketLink" type="text" class="form-control bg-dark border-secondary text-light" placeholder="Bucket Link">
			</div>
			<div class="row w-100 m-0">
				<div class="col p-0">
					<button class="btn btn-success w-100" @click="addBucket(bucketName, bucketLink)">Add Bucket</button>
				</div>
			</div>
		</div>
	</div>
	<div v-else>
		<div class="mb-2 pb-2 border-bottom border-2 border-secondary">
			<ul class="list-group" style="max-height: 17.5vh; overflow-y: scroll;">
				<BucketMenuItem :buckets="knownBuckets" @addBucket="(...args) => addBucket(...args)" />
			</ul>
		</div>
	</div>
</template>

<script>
import { $knownBuckets, execute } from '@/globals'
import BucketMenuItem from './BucketMenuItem.vue';

export default {
    name: "bucketMenu",
    emits: ["updateBuckets"],
    data() {
        return {
            activeMenu: "add-custom-bucket",
            activeClass: "border-light text-white",
            inactiveClass: "border-dark text-secondary",
            knownBuckets: $knownBuckets,
            bucketName: "",
            bucketLink: ""
        };
    },
    methods: {
        toggleActiveMenu(menu) {
            this.activeMenu = menu;
        },
        addBucket(name, link) {
            execute("scoop bucket add " + name + " " + link, (out) => {
                this.$emit("updateBuckets");
                this.updateKnownBuckets();
            });
            this.bucketName = "";
            this.bucketLink = "";
        },
        updateKnownBuckets() {
            this.knownBuckets = $knownBuckets;
        }
    },
    mounted() {
        this.updateKnownBuckets();
    },
    components: { BucketMenuItem }
}
</script>

<style scoped>
	/* ::-webkit-scrollbar {
		width: 0;
	} */

	a {
		transition: color 200ms;
	}

	a:hover {
		color: #c7c8c9 !important
	}

	.text-white:hover {
		color: white !important
	}
</style>