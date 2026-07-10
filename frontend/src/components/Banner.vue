<template>
  <section class="banner">
    <!-- 背景图遮罩层 -->
    <div
      class="banner-mask"
      :class="{ 'banner-mask-transition': isTransitioning }"
      :style="{ backgroundImage: `url(${currentWallpaper.image})` }"
    ></div>
    <div class="banner-overlay"></div>

    <!-- 主内容 -->
    <div class="banner-content">
      <h1 class="hero-title">{{ blogInfo.welcomeText }}</h1>

      <!-- 个人头像卡片 -->
      <div class="info-box" ref="infoBoxRef">
        <img :src="blogInfo.avatar" alt="avatar" class="avatar" />
        <span class="name">{{ blogInfo.name }}</span>
        <div class="hitokoto">
          <p class="hitokoto-text">
            <span>{{ currentHitokoto.text }}</span>
            <span class="cursor">|</span>
          </p>
          <p class="hitokoto-author" :style="{ opacity: authorOpacity }">
            ——「{{ currentHitokoto.author }}」
          </p>
        </div>
        <ul class="social-list">
          <li v-for="social in socialLinks" :key="social.name">
            <a
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="social.name"
              class="social-link"
            >
              <component
                :is="getIconComponent(social.icon)"
                class="social-icon"
              />
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Bing 壁纸信息卡片 -->
    <!-- <div class="bing-info-card">
      <div class="bing-info">
        <span class="bing-info-header">{{ currentWallpaper.title }}</span>
        <hr />
        <div class="bing-info-body">{{ currentWallpaper.description }}</div>
        <div class="bing-info-copyright">{{ currentWallpaper.copyright }}</div>
      </div>
      <div class="bing-location">
        <IconMapPin size="16" stroke="1.5" class="bing-location-icon" />
        {{ currentWallpaper.location }}
      </div> -->
    <!-- 切换按钮 -->
    <!-- <div class="bing-switch">
        <button class="bing-switch-prev" @click="prevWallpaper" title="上一张">
          <IconChevronLeft size="16" stroke="1.5" />
        </button>
        <button class="bing-switch-next" @click="nextWallpaper" title="下一张">
          <IconChevronRight size="16" stroke="1.5" />
        </button>
      </div>
    </div> -->

    <!-- 向下滑动按钮 -->
    <button
      class="slide-down-button"
      @click="scrollToContent"
      aria-label="向下滑动"
    >
      <IconChevronDown size="28" stroke="1.5" class="slide-down-icon" />
      <IconChevronDown
        size="28"
        stroke="1.5"
        class="slide-down-icon slide-down-icon-2"
      />
    </button>
    <!-- 波浪条 -->
    <WaveDivider />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, h, type VNode } from "vue";
import {
  IconMapPin,
  IconChevronLeft,
  IconChevronRight,
  IconChevronDown,
} from "@tabler/icons-vue";
import WaveDivider from "./WaveDivider.vue";
import type { Hitokoto, BingWallpaper, BlogInfo } from "../types";
import {
  blogInfo as blogInfoData,
  socialLinks,
  hitokotos,
  bingWallpapers,
} from "../data/blogData";
import BilibiliIcon from "@/components/icons/Bilibili.vue";

const infoBoxRef = ref<HTMLElement | null>(null);
const currentHitokotoIndex = ref<number>(0);
const currentHitokoto = ref<Hitokoto>(hitokotos[0]);
const blogInfo = ref<BlogInfo>(blogInfoData);
const authorOpacity = ref<number>(1);
let hitokotoTimer: ReturnType<typeof setInterval> | null = null;

const currentWallpaperIndex = ref<number>(0);
const currentWallpaper = ref<BingWallpaper>(bingWallpapers[0]);
const isTransitioning = ref<boolean>(false);

const getIconComponent = (iconName: string): (() => VNode) => {
  const icons: Record<string, () => VNode> = {
    github: () =>
      h(
        "svg",
        {
          width: "1.2em",
          height: "1.2em",
          viewBox: "0 0 24 24",
          fill: "currentColor",
        },
        [
          h("path", {
            d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z",
          }),
        ],
      ),
    twitter: () =>
      h(
        "svg",
        {
          width: "1.2em",
          height: "1.2em",
          viewBox: "0 0 24 24",
          fill: "currentColor",
        },
        [
          h("path", {
            d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
          }),
        ],
      ),
    qq: () =>
      h(
        "svg",
        {
          width: "1.2em",
          height: "1.2em",
          viewBox: "0 0 24 24",
          fill: "currentColor",
        },
        [
          h("path", {
            d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 15.5c-.75.5-1.75.75-3 .75s-2.25-.25-3-.75c.25-.75.75-1.5 1.5-2-.5-.25-1-.5-1.5-1-.5-.5-.75-1.25-.75-2 0-1.5 1-2.75 2.25-3.25.25-.75.75-1.25 1.5-1.5s1.5 0 2 .5c.5.5.75 1.25.5 2 1.25.5 2.25 1.75 2.25 3.25 0 .75-.25 1.5-.75 2-.5.5-1 .75-1.5 1 .75.5 1.25 1.25 1.5 2z",
          }),
        ],
      ),
    bilibili: () => h(BilibiliIcon),
  };
  return icons[iconName] || icons.github;
};

const scrollToContent = (): void => {
  const banner = document.querySelector(".banner");
  if (banner) {
    const height = (banner as HTMLElement).offsetHeight;
    window.scrollTo({ top: height - 60, behavior: "smooth" });
  }
};

const rotateHitokoto = (): void => {
  authorOpacity.value = 0;
  setTimeout(() => {
    currentHitokotoIndex.value =
      (currentHitokotoIndex.value + 1) % hitokotos.length;
    currentHitokoto.value = hitokotos[currentHitokotoIndex.value];
    authorOpacity.value = 1;
  }, 300);
};

const switchWallpaper = (direction: "prev" | "next"): void => {
  if (isTransitioning.value) return;
  isTransitioning.value = true;

  if (direction === "next") {
    currentWallpaperIndex.value =
      (currentWallpaperIndex.value + 1) % bingWallpapers.length;
  } else {
    currentWallpaperIndex.value =
      (currentWallpaperIndex.value - 1 + bingWallpapers.length) %
      bingWallpapers.length;
  }

  currentWallpaper.value = bingWallpapers[currentWallpaperIndex.value];

  setTimeout(() => {
    isTransitioning.value = false;
  }, 500);
};

const prevWallpaper = (): void => switchWallpaper("prev");
const nextWallpaper = (): void => switchWallpaper("next");

const handleKeydown = (e: KeyboardEvent): void => {
  if (e.key === "<" || e.key === "," || e.key === "ArrowLeft") {
    prevWallpaper();
  } else if (e.key === ">" || e.key === "." || e.key === "ArrowRight") {
    nextWallpaper();
  }
};

onMounted(() => {
  hitokotoTimer = setInterval(rotateHitokoto, 5000);

  window.addEventListener("keydown", handleKeydown);

  const box = infoBoxRef.value;
  if (box) {
    const handleMouseMove = (e: MouseEvent): void => {
      const rect = box.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateY = (x / rect.width) * 10;
      const rotateX = -(y / rect.height) * 10;
      box.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    };

    const handleMouseLeave = (): void => {
      box.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)";
    };

    box.addEventListener("mousemove", handleMouseMove);
    box.addEventListener("mouseleave", handleMouseLeave);

    onUnmounted(() => {
      box.removeEventListener("mousemove", handleMouseMove);
      box.removeEventListener("mouseleave", handleMouseLeave);
    });
  }
});

onUnmounted(() => {
  if (hitokotoTimer) {
    clearInterval(hitokotoTimer);
  }
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
.banner {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* 背景图遮罩层 */
.banner-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  z-index: 0;
  animation: maskZoom 20s ease-in-out infinite alternate;
  transition: opacity 0.5s ease-in-out;
}

.banner-mask-transition {
  animation: none;
}

@keyframes maskZoom {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}

/* 暗色遮罩，保证文字可读性 */
.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.2) 50%,
    rgba(0, 0, 0, 0.5) 100%
  );
  z-index: 1;
}

/* 主内容区域 */
.banner-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 80px 24px 80px;
  animation: fadeInUp 1s ease-out;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
  letter-spacing: 2px;
  margin: 0 0 24px;
}

/* 个人头像卡片 */
.info-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 48px 32px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  min-width: 320px;
  position: relative;
  transition: transform 0.1s ease-out;
  transform-style: preserve-3d;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-top: -60px;
  border: 4px solid white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  object-fit: cover;
  background: white;
}

.name {
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.5);
  margin-top: 16px;
}

/* 一言语录 */
.hitokoto {
  min-height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
}

.hitokoto-text {
  font-size: clamp(0.95rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.5);
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.cursor {
  display: inline-block;
  color: rgba(255, 255, 255, 0.8);
  animation: blink 1s infinite;
  font-weight: 300;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

.hitokoto-author {
  font-size: clamp(0.8rem, 1.2vw, 0.95rem);
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
  margin: 0;
  transition: opacity 0.3s ease;
}

/* 社交图标 */
.social-list {
  display: flex;
  list-style: none;
  gap: 20px;
  margin-top: 24px;
  padding: 0;
}

.social-list li {
  list-style: none;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  transition: all var(--transition-time) var(--transition-curve);
}

.social-link:hover {
  background: var(--color-blue);
  color: white;
  transform: translateY(-3px);
}

.social-icon {
  font-size: 1.2em;
}

/* Bing 壁纸信息卡片 */
.bing-info-card {
  position: absolute;
  bottom: 100px;
  left: 40px;
  z-index: 10;
  max-width: 360px;
  animation: fadeInLeft 1.2s ease-out 0.3s both;
}

@keyframes fadeInLeft {
  0% {
    opacity: 0;
    transform: translateX(-30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.bing-info {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 16px 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.bing-info-header {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 10px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.bing-info-header:hover {
  color: #60a5fa;
}

.bing-info hr {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  margin: 0 0 10px;
}

.bing-info-body {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.6;
  margin-bottom: 8px;
}

.bing-info-copyright {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.bing-location {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.65);
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
}

.bing-location-icon {
  width: 1em;
  height: 1em;
  flex-shrink: 0;
}

.bing-switch {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.bing-switch-prev,
.bing-switch-next {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
}

.bing-switch-prev:hover,
.bing-switch-next:hover {
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* 向下滑动按钮 */
.slide-down-button {
  position: absolute;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: rgba(255, 255, 255, 0.8);
  animation: bounce 2s ease-in-out infinite;
  transition: color 0.3s ease;
}

.slide-down-button:hover {
  color: #fff;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-8px);
  }
}

.slide-down-icon {
  width: 28px;
  height: 28px;
}

.slide-down-icon-2 {
  animation: fadeInDelayed 2s ease-in-out infinite;
}

@keyframes fadeInDelayed {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

@media (max-width: 768px) {
  .banner-content {
    padding: 60px 16px 60px;
  }

  .info-box {
    padding: 0 24px 24px;
    min-width: 280px;
  }

  .avatar {
    width: 100px;
    height: 100px;
    margin-top: -50px;
  }

  .name {
    font-size: 1.5rem;
  }

  .bing-info-card {
    bottom: 90px;
    left: 16px;
    right: 16px;
    max-width: none;
  }

  .bing-info {
    padding: 12px 16px;
  }

  .bing-info-header {
    font-size: 0.9rem;
  }

  .bing-info-body {
    font-size: 0.8rem;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .hero-title {
    font-size: 1.8rem;
  }
}
</style>
