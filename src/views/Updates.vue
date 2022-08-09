<template>
  <ul class="list-group pt-2" style="max-height: 91.5vh; overflow-y: scroll; padding-left: 10px;">
    <AppItem v-for="app in appsToUpdate" @updateData="updateData" v-bind="app" />
  </ul>
</template>

<script>
import { $appsToUpdate } from '@/globals'
import AppItem from '../components/AppItem.vue'

export default {
  name: 'Updates',
  data() {
    return {
      appsToUpdate: []
    }
  },
  methods: {
    updateData() {
      this.appsToUpdate = $appsToUpdate
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
