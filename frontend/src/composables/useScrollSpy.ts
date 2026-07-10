import { ref, onMounted, onUnmounted, type Ref } from "vue";
import type { TocItem } from "../types";

/**
 * 滚动监听，高亮当前可见的标题
 * @param toc 目录项的响应式引用
 * @param offset 触发高亮的顶部偏移量
 */
export function useScrollSpy(toc: Ref<TocItem[]>, offset = 120) {
  const activeHeading = ref<string>("");

  const update = (): void => {
    const headings = toc.value;
    for (let i = headings.length - 1; i >= 0; i--) {
      const el = document.getElementById(headings[i].id);
      if (el && el.getBoundingClientRect().top < offset) {
        activeHeading.value = headings[i].id;
        return;
      }
    }
    if (headings.length > 0) {
      activeHeading.value = headings[0].id;
    }
  };

  onMounted(() => {
    window.addEventListener("scroll", update, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", update);
  });

  return { activeHeading, update };
}
