import { marked } from 'marked'

// 配置 marked（在 Worker 中只需配置一次）
marked.setOptions({
  gfm: true,
  breaks: false,
})

self.onmessage = (e: MessageEvent<string>) => {
  const markdown = e.data

  if (!markdown) {
    self.postMessage({ html: '' } as MessagePayload)
    return
  }

  try {
    const html = marked.parse(markdown) as string
    self.postMessage({ html } as MessagePayload)
  } catch (err) {
    self.postMessage({
      html: '',
      error: err instanceof Error ? err.message : 'Markdown 解析失败',
    } as MessagePayload)
  }
}

interface MessagePayload {
  html: string
  error?: string
}
