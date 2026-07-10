<template>
  <div class="home-page">
    <Banner />
    <PostList />
  </div>
</template>

<script setup lang="ts">
import Banner from '../components/Banner.vue'
import PostList from '../components/PostList.vue'
</script>

<style scoped>
.home-page {
  flex: 1;
}
</style>
