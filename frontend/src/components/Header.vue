<template>
  <header class="header" :class="{ 'header-scrolled': isScrolled }">
    <div
      class="header-inner"
      :class="{ 'header-solid': isScrolled, 'header-transparent': !isScrolled }"
    >
      <div class="logo">
        <router-link to="/" class="nav-link">
          <div class="logo-icon">
            <svg viewBox="0 0 100 100" class="logo-svg">
              <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" />
              <defs>
                <linearGradient
                  id="logoGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    style="stop-color: #60a5fa; stop-opacity: 1"
                  />
                  <stop
                    offset="100%"
                    style="stop-color: #3b82f6; stop-opacity: 1"
                  />
                </linearGradient>
              </defs>
              <text
                x="50"
                y="62"
                text-anchor="middle"
                fill="white"
                font-size="32"
                font-weight="bold"
              >
                Y
              </text>
            </svg>
          </div>
        </router-link>
      </div>
      <nav class="menu">
        <ul>
          <li v-for="link in navLinks" :key="link.path">
            <router-link
              :to="link.path"
              class="nav-link"
              :class="{ active: isActive(link.path) }"
            >
              {{ link.name }}
            </router-link>
          </li>
        </ul>
      </nav>
      <div class="header-right">
        <button
          class="icon-btn"
          title="搜索 (Alt+S)"
          @click="searchOpen = true"
        >
          <IconSearch size="20" stroke="1.5" />
          <kbd class="shortcut-hint">Alt+S</kbd>
        </button>
        <div class="hamburger" @click="toggleMenu">
          <span class="line"></span>
          <span class="line"></span>
          <span class="line"></span>
        </div>
      </div>
    </div>
    <div
      v-if="mobileMenuOpen"
      class="mobile-menu"
      :class="{ 'header-solid': isScrolled, 'header-transparent': !isScrolled }"
    >
      <ul>
        <li
          v-for="link in navLinks"
          :key="link.path"
          @click="mobileMenuOpen = false"
        >
          <router-link
            :to="link.path"
            class="nav-link"
            :class="{ active: isActive(link.path) }"
          >
            {{ link.name }}
          </router-link>
        </li>
      </ul>
    </div>
    <SearchModal v-if="searchOpen" @close="searchOpen = false" />
  </header>
  <MusicPlayer />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { IconSearch } from "@tabler/icons-vue";
import { navLinks } from "../data/blogData";
import SearchModal from "./SearchModal.vue";
import MusicPlayer from "./MusicPlayer.vue";

const route = useRoute();
const mobileMenuOpen = ref(false);
const isScrolled = ref(false);
const searchOpen = ref(false);

const isActive = (path: string): boolean => {
  if (path === "/") {
    return route.path === "/";
  }
  return route.path.startsWith(path);
};

const toggleMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 100;
};

const handleGlobalKeydown = (e: KeyboardEvent) => {
  if (e.altKey && (e.key === "s" || e.key === "S")) {
    e.preventDefault();
    searchOpen.value = true;
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("keydown", handleGlobalKeydown);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("keydown", handleGlobalKeydown);
});
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.header-scrolled {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  width: 100%;
  padding: 12px 40px;
  position: relative;
  transition: all 0.3s ease;
}

.header-transparent {
  background: transparent;
  border: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.header-solid {
  background: rgba(255, 255, 255, 0.95);
  border: none;
}

/* 透明状态下的文字样式 */
.header:not(.header-scrolled) .nav-link {
  color: rgba(255, 255, 255, 0.9);
}

.header:not(.header-scrolled) .nav-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.15);
}

.header:not(.header-scrolled) .nav-link.active {
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
}

.header:not(.header-scrolled) .icon-btn {
  color: rgba(255, 255, 255, 0.9);
}

.header:not(.header-scrolled) .icon-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.15);
}

.header:not(.header-scrolled) .hamburger .line {
  background: rgba(255, 255, 255, 0.9);
}

.logo {
  display: flex;
  align-items: center;
}

.logo-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.logo-svg {
  width: 100%;
  height: 100%;
}

.menu ul {
  display: flex;
  list-style: none;
  gap: 8px;
}

.menu li {
  position: relative;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  padding: 8px 20px;
  color: var(--font-color-grey);
  font-weight: 600;
  font-size: 15px;
  border-radius: 10px;
  transition: all var(--transition-time) var(--transition-curve);
  position: relative;
}

.nav-link:hover {
  color: var(--color-blue);
  background: rgba(var(--blue-shadow-color), 0.08);
}

.nav-link.active {
  color: var(--color-blue);
  background: rgba(var(--blue-shadow-color), 0.12);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-btn {
  background: transparent;
  color: var(--font-color-grey);
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.shortcut-hint {
  font-family: inherit;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 5px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.06);
  color: currentColor;
  opacity: 0.6;
  border: 1px solid rgba(0, 0, 0, 0.08);
  line-height: 1;
}

.header:not(.header-scrolled) .shortcut-hint {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
  opacity: 0.8;
}

@media (max-width: 768px) {
  .shortcut-hint {
    display: none;
  }
}

.icon-btn:hover {
  background: rgba(var(--blue-shadow-color), 0.1);
  color: var(--color-blue);
  transform: none;
}

.hamburger {
  display: none;
  flex-direction: column;
  cursor: pointer;
  padding: 8px;
  gap: 5px;
}

.hamburger .line {
  width: 24px;
  height: 2px;
  background: var(--font-color-grey);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding: 16px 40px;
  z-index: 1001;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.mobile-menu.header-transparent {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-menu.header-solid {
  background: rgba(255, 255, 255, 0.95);
}

.header:not(.header-scrolled) .mobile-menu .nav-link {
  color: rgba(255, 255, 255, 0.9);
}

.header:not(.header-scrolled) .mobile-menu .nav-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.15);
}

.header:not(.header-scrolled) .mobile-menu .nav-link.active {
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
}

.mobile-menu ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-menu li {
  width: 100%;
}

.mobile-menu .nav-link {
  width: 100%;
  padding: 12px 16px;
}

@media (max-width: 768px) {
  .menu {
    display: none;
  }

  .hamburger {
    display: flex;
  }

  .mobile-menu {
    display: block;
  }

  .header-inner {
    padding: 12px 20px;
  }

  .mobile-menu {
    padding: 16px 20px;
  }
}
</style>
