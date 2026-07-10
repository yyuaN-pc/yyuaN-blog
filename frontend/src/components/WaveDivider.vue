<template>
  <div class="wave-divider" :style="{ '--wave-color': color }">
    <svg class="wave-svg" viewBox="0 0 1200 160" preserveAspectRatio="none">
      <defs>
        <linearGradient :id="gradientId1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="color" stop-opacity="0" />
          <stop offset="30%" :stop-color="color" stop-opacity="0.4" />
          <stop offset="70%" :stop-color="color" stop-opacity="0.9" />
          <stop offset="100%" :stop-color="color" stop-opacity="1" />
        </linearGradient>
        <linearGradient :id="gradientId2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="color" stop-opacity="0.2" />
          <stop offset="50%" :stop-color="color" stop-opacity="0.7" />
          <stop offset="100%" :stop-color="color" stop-opacity="1" />
        </linearGradient>
      </defs>
      <path
        d="M0,80 C150,160 350,0 600,80 C850,160 1050,0 1200,80 L1200,160 L0,160 Z"
        :fill="`url(#${gradientId1})`"
        class="wave wave1"
      />
      <path
        d="M0,100 C200,20 450,140 700,60 C900,160 1100,80 1200,100 L1200,160 L0,160 Z"
        :fill="`url(#${gradientId2})`"
        class="wave wave2"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  color: {
    type: String,
    default: "#eaeff5",
  },
});

// 用随机 ID 避免多实例冲突
const gradientId1 = computed(
  () => `waveGrad1-${Math.random().toString(36).slice(2, 8)}`
);
const gradientId2 = computed(
  () => `waveGrad2-${Math.random().toString(36).slice(2, 8)}`
);
</script>

<style scoped>
.wave-divider {
  position: absolute;
  bottom: 0;
  left: -5%;
  width: 110%;
  line-height: 0;
  z-index: 5;
  pointer-events: none;
}

.wave-svg {
  width: 100%;
  height: 160px;
  display: block;
}

.wave {
  animation: wave 8s ease-in-out infinite;
  transform-origin: center bottom;
}

.wave1 {
  animation-delay: 0s;
}

.wave2 {
  animation-delay: -4s;
}

@keyframes wave {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-20px);
  }
}
</style>
