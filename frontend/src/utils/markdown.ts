import type { TocItem } from "../types";

/**
 * 从文本生成标题 id（支持中文）
 */
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * 从 Markdown 内容中提取目录
 */
export function extractToc(markdown: string): TocItem[] {
  const headings: TocItem[] = [];
  const lines = markdown.split("\n");
  for (const line of lines) {
    const match = line.match(/^(#{1,4})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/[`*]/g, "");
      const id = generateHeadingId(text);
      headings.push({ level, text, id });
    }
  }
  return headings;
}

/**
 * 为容器内的所有标题元素添加 id
 */
export function assignHeadingIds(container: HTMLElement): void {
  const headers = container.querySelectorAll("h1, h2, h3, h4");
  headers.forEach((h) => {
    const text = h.textContent?.replace(/[`*]/g, "") || "";
    h.id = generateHeadingId(text);
  });
}
