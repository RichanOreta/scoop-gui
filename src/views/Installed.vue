<template>
  <ul class="list-group pt-2" style="max-height: 91.5vh; overflow-y: scroll; padding-left: 10px;">
    <AppItem v-for="app in installedApps" @updateData="updateData" v-bind="app" />
  </ul>
</template>

<script>
import { $installedApps } from '@/globals'
import AppItem from '../components/AppItem.vue'

export default {
  name: 'Installed',
  data() {
    return {
      installedApps: []
    }
  },
  methods: {
    updateData() {
      this.installedApps = $installedApps
    }
  },
  components: {
    AppItem
  },
  mounted() {
    this.updateData()
  }
}
</script>

<style>
</style>
