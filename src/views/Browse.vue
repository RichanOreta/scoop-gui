<template>
  <div class="row w-100 mx-0">
    <div class="col-3 px-0" style="background-color: #24252b; height: 91.5vh;">
      <div class="mx-3 pt-2">
        <BucketMenu @updateBuckets="updateData()" ref="bucketmenu" />
      </div>
      <ul class="list-group bucketList" style="max-height: 91.5vh; overflow-y: scroll;">
        <BucketListItem @toggleActiveBucket="toggleActiveBucket($event)" @removeBucket="removeBucket($event)" :activeBucket="activeBucket" :buckets="buckets" />
      </ul>
    </div>
    <div class="col-9 pe-0">
      <ul class="list-group pt-2" style="max-height: 91.5vh; overflow-y: scroll;">
        <AppItem v-for="app in apps" @updateData="updateData" v-bind="app" />
      </ul>
    </div>
  </div>
</template>

<script>
import { $bucketFiles, $buckets, $installedApps, execute } from '@/globals'
import AppItem from '../components/AppItem.vue'
import BucketMenu from '@/components/BucketMenu.vue'
import BucketListItem from '@/components/BucketListItem.vue'

export default {
  name: 'Browse',
  data() {
    return {
      activeBucket: '',
      buckets: [],
      bucketFiles: {},
      apps: [],
      installedApps: [],
    }
  },
  methods: {
    toggleActiveBucket(bucket) {
      this.activeBucket = bucket
      this.apps = this.bucketFiles[this.activeBucket]
    },
    updateData() {
      this.buckets = $buckets
      this.bucketFiles = $bucketFiles
      this.installedApps = $installedApps
      this.$refs.bucketmenu.updateKnownBuckets()
    },
    removeBucket(index) {
      const bucketToRemove = this.buckets.splice(index, 1)
      execute('scoop bucket rm ' + bucketToRemove, (out) => {
        this.updateData()
      })

      if (this.activeBucket == bucketToRemove) {
        this.activeBucket = this.buckets[0]
      }
      this.apps = this.bucketFiles[this.activeBucket]
    }
  },
  components: {
    AppItem,
    BucketMenu,
    BucketListItem
  },
  mounted() {
    this.updateData()
    this.activeBucket = this.buckets[0]
    this.apps = this.bucketFiles[this.activeBucket]
  }
}
</script>

<style>
  #bucket-item {
    background-color: #24252b;
    border-radius: 0;
    border: 0;
    transition: all 200ms;
  }

  #bucket-item:hover {
    background-color: #46484d;
  }

  #bucket-item:active {
    background-color: #0b2568;
  }

  .activeBucket {
    background-color: #204f8c !important;
  }

  .activeBucket:hover {
    background-color: #2767ba !important;
  }

  .bucketList::-webkit-scrollbar {
    width: 0px;
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

  a {
    text-decoration: none;
  }
</style>
