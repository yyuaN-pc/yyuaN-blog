<template>
  <transition name="backtop">
    <div v-show="visible" class="back-to-top" @click="scrollToTop">
      <!-- 进度环 SVG -->
      <svg class="progress-svg" viewBox="0 0 56 56">
        <defs>
          <clipPath id="water-clip">
            <rect
              x="0"
              :y="56 - (56 * progress / 100)"
              width="56"
              :height="56 * progress / 100"
            />
          </clipPath>
        </defs>
        <!-- 底层空圆 -->
        <circle cx="28" cy="28" r="27" class="circle-bg" />
        <!-- 注水填充圆 -->
        <circle cx="28" cy="28" r="27" class="circle-fill" clip-path="url(#water-clip)" />
      </svg>
      <!-- 图标和文字（蓝色，水面上方） -->
      <div class="top-icon top-icon-blue">
        <IconArrowUp size="20" stroke="1.5" />
        <span>返回顶部</span>
      </div>
      <!-- 图标和文字（白色，水面下方） -->
      <div
        class="top-icon top-icon-white"
        :style="{ clipPath: `inset(${100 - progress}% 0 0 0)` }"
      >
        <IconArrowUp size="20" stroke="1.5" />
        <span>返回顶部</span>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { IconArrowUp } from "@tabler/icons-vue";

const visible = ref(false);
const progress = ref(0);

const handleScroll = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  visible.value = scrollTop > 400;
  if (docHeight > 0) {
    progress.value = Math.min(100, (scrollTop / docHeight) * 100);
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.back-to-top {
  position: fixed;
  right: 40px;
  bottom: 40px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 999;
  transition: transform 0.2s ease;
}

.back-to-top:hover {
  transform: translateY(-4px);
}

.progress-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.circle-bg {
  fill: rgba(255, 255, 255, 0.9);
  stroke: rgba(64, 128, 255, 0.3);
  stroke-width: 1;
}

.circle-fill {
  fill: var(--color-blue, #4080ff);
}

.wave-surface {
  fill: var(--color-blue, #4080ff);
  opacity: 0.8;
}

.top-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: 0.65rem;
  line-height: 1;
}

.top-icon-blue {
  color: var(--color-blue, #4080ff);
}

.top-icon-white {
  color: #fff;
}

.progress-text {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.6rem;
  color: var(--color-blue, #4080ff);
  white-space: nowrap;
  opacity: 0.7;
}

/* 出现/消失动画 */
.backtop-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.backtop-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.backtop-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.8);
}

.backtop-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.8);
}

@media (max-width: 768px) {
  .back-to-top {
    right: 20px;
    bottom: 20px;
    width: 48px;
    height: 48px;
  }
}
</style>
