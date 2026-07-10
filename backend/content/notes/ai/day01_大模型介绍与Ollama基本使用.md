---
title: 大模型介绍与Ollama基本使用
category: ai
date: 2026年6月8日
datetime: 2026-06-08T00:00:00.000Z
wordCount: 约 1700 字
readTime: 预计 10 分钟
excerpt: 了解大模型的基础概念与分类，学习使用Ollama在本地私有化部署并运行大语言模型，通过Chatbox实现可视化对话。
tags: [AI, Ollama, LLM]
cover: "./covers/Ollama.png"
---

# 大模型介绍与Ollama基本使用

## 1. 大模型

大语言模型（Large Language Model，简称LLM）是一种基于深度学习技术的人工智能模型，通过海量文本数据训练而成，能够理解和生成自然语言。

## 2. Ollama 简介

**Ollama** 是一个轻量级、开源的本地大语言模型管理工具。它的核心理念是"让大模型像安装普通软件一样简单"——不需要复杂的 Python 环境配置，不需要理解 CUDA、PyTorch 等底层技术栈，一条命令即可下载、启动、使用主流大模型。

### 2.1 为什么选择 Ollama

| 优势 | 说明 |
|------|------|
| **极简安装** | 下载安装包后开箱即用，无需配置环境变量以外的任何操作 |
| **跨平台** | 支持 Windows、macOS（含 M 系列芯片）、Linux |
| **模型市场** | 官方模型库涵盖上百个主流开源模型，一键 `pull` 下载 |
| **数据隐私** | 所有计算在本地完成，数据不出网 |
| **离线可用** | 下载模型后完全离线运行，无需联网 |
| **API 兼容** | 提供 OpenAI 兼容的 API，可被任何支持 OpenAI 协议的客户端调用 |

### 2.2 硬件要求

| 配置级别 | 内存需求 | 可运行模型 | 体验 |
|---------|---------|-----------|------|
| 最低 | 4GB | 1B~3B（如 Qwen2.5:1.5B、Phi-3:mini） | 速度尚可，能力有限 |
| 推荐 | 16GB | 7B~8B（如 Qwen3:8B、Llama 3.1:8B） | 流畅运行，实用性强 |
| 进阶 | 32GB+ | 14B~32B + GPU 加速 | 高质量输出 |
| 高阶 | 64GB + 显卡 | 70B 量化版 | 接近云端能力 |

> 显存估算公式：`参数量(B) × 位宽(bit) ÷ 8 × 1.2 ≈ 所需显存(GB)`。例如 8B 参数、4bit 量化：`8 × 4 ÷ 8 × 1.2 = 4.8GB`。

## 3. 安装 Ollama

### 3.1 Windows

1. 访问 [ollama.com/download](https://ollama.com/download) 下载 `OllamaSetup.exe`
2. 双击运行安装程序（可自定义安装路径：`OllamaSetup.exe /DIR=D:\tools\ollama`）
3. 安装完成后，打开终端（PowerShell 或 CMD），验证安装：
   ```bash
   ollama --version
   ```

### 3.2 macOS

```bash
# 方式一：Homebrew 安装（推荐）
brew install ollama

# 方式二：从官网下载安装包
# 访问 https://ollama.com/download 下载 macOS 版本
```

### 3.3 Linux

```bash
# 一键安装脚本（Ubuntu / Debian / CentOS）
curl -fsSL https://ollama.com/install.sh | sh

# 启动服务
sudo systemctl start ollama
sudo systemctl enable ollama  # 开机自启
```

### 3.4 Docker 部署（服务器环境）

```bash
# 启动 Ollama 容器（CPU 模式）
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama

# 启用 GPU 加速（需要 NVIDIA 显卡 + nvidia-container-toolkit）
docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

### 3.5 配置模型存储路径（Windows）

默认模型会下载到 C 盘，如果要迁移到其他盘：

1. 创建系统环境变量 `OLLAMA_MODELS`，值为目标路径（如 `D:\ollama\models`）
2. 重启电脑或重启 Ollama 服务
3. 将 C 盘 `~/.ollama/models` 中的内容移动到新路径

## 4. 下载与运行模型

### 4.1 常用命令

| 命令 | 说明 |
|------|------|
| `ollama list` | 查看已下载的模型列表 |
| `ollama pull <模型名>` | 下载指定模型 |
| `ollama run <模型名>` | 运行模型并进入交互对话 |
| `ollama rm <模型名>` | 删除指定模型 |
| `ollama ps` | 查看当前正在运行的模型 |
| `ollama show <模型名>` | 查看模型详细信息 |

### 4.2 推荐模型

```bash
# 中文强模型（阿里通义千问系列）
ollama pull qwen3:8b      # 8B 参数，中文表现优秀
ollama pull qwen3:0.6b    # 轻量版，低配福音

# Meta Llama 系列
ollama pull llama3.2:3b   # 轻量高效
ollama pull llama3.1:8b   # 推荐平衡款

# 其他优秀模型
ollama pull mistral:7b    # 英文小模型标杆
ollama pull gemma2:9b     # Google 出品
ollama pull deepseek-r1:7b # 国产推理模型
```

### 4.3 交互式对话

```bash
# 启动模型，进入交互模式
ollama run qwen3:8b

>>> 你好！
我是通义千问，很高兴为你服务。

>>> 用 Python 写一个快速排序算法
# 以下是快速排序的实现...
```

### 4.4 退出对话

在交互模式中输入 `/bye` 即可退出。

## 5. 可视化客户端（Chatbox / Open WebUI）

命令行交互不够直观，好在有丰富的可视化客户端可选。

### 5.1 Chatbox（推荐新手）

[Chatbox](https://chatboxai.app/) 是一款开源的 AI 桌面客户端，支持 Windows / macOS / Linux。

配置步骤：
1. 下载并安装 Chatbox
2. 进入设置 → 模型提供方 → 选择 **Ollama API**
3. API 地址填写：`http://localhost:11434`
4. 模型选择已下载好的模型（如 `qwen3:8b`）
5. 开始对话

这样你就拥有了一个**完全本地、无需联网、数据不出本机**的 ChatGPT 体验。

### 5.2 Open WebUI（网页版）

```bash
docker run -d -p 3000:8080 \
  --add-host=host.docker.internal:host-gateway \
  -v open-webui:/app/backend/data \
  --name open-webui \
  --restart always \
  ghcr.io/open-webui/open-webui:main
```

访问 `http://localhost:3000` 即可使用类 ChatGPT 的网页界面。

## 6. API 调用（开发者模式）

Ollama 默认在 `http://localhost:11434` 启动 API 服务，兼容 OpenAI 协议。

### 6.1 使用 curl 调用

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "qwen3:8b",
  "prompt": "用鲁迅的风格写一段程序员的加班感悟",
  "stream": false
}'
```

### 6.2 Python SDK

```python
import requests

response = requests.post(
    "http://localhost:11434/api/generate",
    json={
        "model": "qwen3:8b",
        "prompt": "解释一下什么是区块链",
        "stream": False
    }
)
print(response.json()["response"])
```

### 6.3 OpenAI 兼容接口

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"  # 随意填写
)

response = client.chat.completions.create(
    model="qwen3:8b",
    messages=[{"role": "user", "content": "你好"}]
)
print(response.choices[0].message.content)
```

## 7. 自定义模型（Modelfile）

可以通过 `Modelfile` 基于现有模型微调系统提示词和参数，定制专属助手。

### 7.1 创建 Modelfile

```
FROM qwen3:8b

# 设置系统角色
SYSTEM """
你是一位资深的 Linux 运维工程师，擅长用简洁的语言解释技术问题。
回答时优先给出命令示例，保持专业且友好。
"""

# 调整参数
PARAMETER temperature 0.7
PARAMETER num_ctx 4096
```

### 7.2 构建并运行

```bash
# 构建自定义模型
ollama create my-ops -f ./Modelfile

# 运行自定义模型
ollama run my-ops
```

## 8. 性能优化与常见问题

### 8.1 GPU 加速

```bash
# NVIDIA 显卡自动调用 CUDA，无需额外配置
# 验证显卡是否生效
nvidia-smi
```

### 8.2 使用量化版节省内存

```bash
# 4bit 量化版，内存占用更低
ollama pull qwen3:8b-q4_K_M
```

### 8.3 常见问题

| 问题 | 解决 |
|------|------|
| `Error: insufficient memory` | 换更小的模型或使用量化版；增加虚拟内存 |
| 下载速度慢 | 使用代理或从国内镜像（魔搭 ModelScope）下载 GGUF 格式模型后导入 |
| 模型回答不理想 | 调整 `temperature` 参数（越低越严谨，越高越有创意） |

## 9. 总结

通过 Ollama，本地部署大模型已经变得前所未有的简单。回顾一下我们做了什么：

1. 了解了 **大模型的基本概念**——输入文本、输出文本的 AI 大脑
2. 安装了 **Ollama**——像装普通软件一样简单
3. 下载并运行了 **Qwen3 / Llama3** 等模型
4. 配置了 **Chatbox**——拥有本地版 ChatGPT
5. 学会了 **API 调用**——供自己的程序使用

本地部署的核心价值在于：**数据隐私、离线可用、零成本无限调用**。无论是用于学习研究、辅助编程，还是搭建企业内部 AI 助手，Ollama 都是一个完美的起点。

下一步可以尝试：接入 [Dify](https://dify.ai/) 搭建 RAG 知识库应用，或使用 [Spring AI](https://spring.io/projects/spring-ai) 将大模型集成到 Java 后端服务中。
