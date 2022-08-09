<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary">
    <div class="container-fluid position-relative">
      <form class="position-absolute top-0 start-0 d-flex ps-2 pt-1" v-on:submit.prevent>
        <input class="form-control me-2" type="search" placeholder="Search App" aria-label="search" v-model="searchInput">
        <button class="btn btn-outline-success" tyoe="button" @click="search()"><i class="fa-solid fa-magnifying-glass"></i></button>
      </form>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsupportedcontent" aria-controls="navbarsupportedcontent" aria-expanded="false" aria-label="toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarsupportedcontent">
        <ul class="navbar-nav w-100 d-flex justify-content-center">
          <li class="nav-item">
            <router-link class="nav-link px-3 border-bottom border-2 bg-dark" :class="[currentPage == 'browse' ? activeClass : 'border-dark']" @click="togglePage('browse')" to="/">Browse</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link px-3 border-bottom border-2 bg-dark" :class="[currentPage == 'installed' ? activeClass : 'border-dark']" @click="togglePage('installed')" to="/installed">Installed</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link px-3 border-bottom border-2 bg-dark" :class="[currentPage == 'updates' ? activeClass : 'border-dark']" @click="togglePage('updates')" to="/updates">Updates ({{numberOfAppsToUpdate}})</router-link>
          </li>
        </ul>
      </div>
      <div class="position-absolute top-0 end-0 pe-2 pt-1">
        <router-link class="btn btn-outline-secondary w-100" @click="togglePage('output')" to="/output">Command Output</router-link>
      </div>
    </div>
  </nav>
  <div v-if="currentPage == 'search'">
    <ul v-if="searchResults.length > 0" class="list-group pt-2" style="max-height: 91.5vh; overflow-y: scroll; padding-left: 10px;">
      <AppItem v-for="app in searchResults" @updateData="search" v-bind="app" />
    </ul>
    <div v-else class="mt-5 text-center text-secondary">
      <h3>App Not Found</h3>
    </div>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import { searchApp, $searchResults, $appsToUpdate } from './globals';
import AppItem from './components/AppItem.vue'

export default {
  name: 'App',
  data() {
    return {
      currentPage: 'browse',
      activeClass: 'active border-light',
      searchInput: '',
      searchResults: [],
      numberOfAppsToUpdate: $appsToUpdate.length
    }
  },
  methods: {
    togglePage(page) {
      this.currentPage = page
      this.$sessionStorage.set('page', this.currentPage)
    },
    search() {
      searchApp(this.searchInput)
      this.searchResults = $searchResults
      this.currentPage = 'search'
    }
  },
  components: {
    AppItem
  },
  mounted() {
    const storageItem = this.$sessionStorage.get('page')

    if (storageItem) {
      this.currentPage = storageItem
    }
  }
}
</script>

<style>
  body {
    background-color: #2c2f35;
    overflow: hidden;
  }

  mark {
    background-color: #8e621d;
    padding: 0;
  }
</style>
