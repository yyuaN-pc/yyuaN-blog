<template>
  <div id="app">
    <Header />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <footer class="footer">
      <div class="container footer-content">
        <p>&copy; 2026 YY Blog. All rights reserved.</p>
      </div>
    </footer>
    <BackToTop />
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import BackToTop from './components/BackToTop.vue'
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.footer {
  background: #fff;
  padding: 24px 0;
  margin-top: auto;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.footer-content {
  text-align: center;
  color: var(--font-color-grey);
  font-size: 0.9rem;
  opacity: 0.7;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
