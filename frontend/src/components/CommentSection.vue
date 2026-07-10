<template>
  <div class="comment-container">
    <!-- ============================================================
         评论输入区
         ============================================================ -->
    <div class="comment-form">
      <!-- 用户信息区 -->
      <div class="form-user-info">
        <div class="info-row">
          <div class="field-group nickname-group">
            <label class="field-label">昵称</label>
            <input
              type="text"
              class="field-input"
              placeholder="输入昵称（留空为匿名）"
              v-model="nickname"
              maxlength="20"
            />
          </div>
          <div class="field-group contact-group">
            <label class="field-label">联系方式</label>
            <div class="contact-row">
              <div class="contact-type-select">
                <button
                  v-for="opt in contactOptions"
                  :key="opt.value"
                  class="contact-type-btn"
                  :class="{ active: contactType === opt.value }"
                  @click="contactType = opt.value"
                  :title="opt.label"
                >
                  {{ opt.icon }}
                </button>
              </div>
              <input
                type="text"
                class="field-input contact-input"
                :placeholder="contactPlaceholder"
                v-model="contact"
                maxlength="60"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 评论输入区 -->
      <div class="form-input-area">
        <textarea
          class="comment-textarea"
          :placeholder="
            currentUser ? `${currentUser}，说点什么吧...` : '说点什么吧...'
          "
          v-model="content"
          maxlength="500"
          @input="onInput"
        ></textarea>
        <div class="char-count" :class="{ warn: content.length > 450 }">
          {{ content.length }} / 500
        </div>
      </div>

      <!-- 功能按键区 -->
      <div class="form-actions">
        <div class="actions-left">
          <button class="action-btn" title="表情" @click="toggleEmojiPicker">
            <IconMoodSmile size="18" stroke="1.5" />
          </button>
          <button class="action-btn" title="上传图片" @click="uploadImage">
            <IconPhoto size="18" stroke="1.5" />
          </button>
          <!-- 表情选择器 -->
          <div v-if="showEmoji" class="emoji-picker" @click.stop>
            <button
              v-for="emoji in emojis"
              :key="emoji"
              class="emoji-item"
              @click="insertEmoji(emoji)"
            >
              {{ emoji }}
            </button>
          </div>
        </div>
        <button
          class="submit-btn"
          @click="submitComment"
          :disabled="submitting || !content.trim()"
        >
          <IconSend size="16" stroke="1.5" />
          提交
        </button>
      </div>
    </div>

    <!-- 上传图片预览 -->
    <div v-if="uploadedImage" class="image-preview">
      <img :src="uploadedImage" alt="上传预览" class="preview-img" />
      <button class="remove-img" @click="uploadedImage = null">&times;</button>
    </div>

    <!-- ============================================================
         评论区（分页展示）
         ============================================================ -->
    <div class="comment-list">
      <div v-if="loading" class="list-status">加载中...</div>
      <div v-else-if="comments.length === 0" class="list-status list-empty">
        <IconMessage2 size="32" stroke="1.5" />
        <span>暂无评论，来写第一条吧</span>
      </div>
      <div v-else>
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <!-- 主评论 -->
          <div class="comment-header">
            <span class="comment-nickname">
              <IconUser size="14" stroke="1.5" />
              {{ comment.nickname }}
            </span>
            <a
              v-if="comment.contact"
              :href="formatContactUrl(comment)"
              target="_blank"
              class="comment-contact"
              :title="comment.contact"
            >
              {{ getContactIcon(comment.contactType) }}
              {{ comment.contact }}
            </a>
            <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
          </div>
          <div class="comment-body">
            <p class="comment-content" v-html="highlightFiltered(comment.content)"></p>
            <img
              v-if="comment.image"
              :src="comment.image"
              class="comment-image"
              @click="previewImage = comment.image"
            />
            <!-- 回复按钮 -->
            <div class="comment-actions">
              <button class="reply-btn" @click="toggleReply(comment.id)">
                <IconMessage2 size="13" stroke="1.5" />
                回复
              </button>
            </div>
          </div>

          <!-- 回复列表 -->
          <div v-if="comment.replies && comment.replies.length > 0" class="replies-area">
            <!-- 折叠/展开按钮 -->
            <button
              v-if="comment.replies.length > 0"
              class="toggle-replies-btn"
              @click="toggleReplies(comment.id)"
            >
              {{ expandedReplies[comment.id] ? '收起回复' : `查看回复 (${comment.replies.length})` }}
            </button>
            <div v-if="expandedReplies[comment.id]" class="replies-list">
              <div
                v-for="reply in comment.replies"
                :key="reply.id"
                class="reply-item"
              >
                <div class="reply-header">
                  <span class="reply-nickname">
                    <IconUser size="12" stroke="1.5" />
                    {{ reply.nickname }}
                  </span>
                  <span class="reply-to">回复</span>
                  <span class="reply-to-nickname">{{ reply.replyToNickname }}</span>
                  <span class="reply-time">{{ formatTime(reply.createdAt) }}</span>
                </div>
                <div class="reply-content" v-html="highlightFiltered(reply.content)"></div>
              </div>
            </div>
          </div>

          <!-- 回复输入框 -->
          <div v-if="replyingTo === comment.id" class="reply-form">
            <div class="reply-form-row">
              <input
                type="text"
                class="reply-input"
                v-model="replyContent"
                placeholder="写下你的回复..."
                maxlength="500"
                @keyup.enter="submitReply(comment.id)"
              />
              <button
                class="reply-submit-btn"
                @click="submitReply(comment.id)"
                :disabled="replySubmitting || !replyContent.trim()"
              >
                发送
              </button>
              <button class="reply-cancel-btn" @click="cancelReply">取消</button>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="totalPages > 1" class="pagination">
          <button
            class="page-btn"
            :disabled="currentPage <= 1"
            @click="goPage(currentPage - 1)"
          >
            &lt;
          </button>
          <button
            v-for="p in visiblePages"
            :key="p"
            class="page-btn"
            :class="{ active: p === currentPage }"
            @click="goPage(p)"
          >
            {{ p }}
          </button>
          <button
            class="page-btn"
            :disabled="currentPage >= totalPages"
            @click="goPage(currentPage + 1)"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>

    <!-- 图片预览弹窗 -->
    <Teleport to="body">
      <div
        v-if="previewImage"
        class="image-overlay"
        @click="previewImage = null"
      >
        <img :src="previewImage" class="overlay-img" />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import {
  IconMoodSmile,
  IconPhoto,
  IconSend,
  IconMessage2,
  IconUser,
} from "@tabler/icons-vue";
import type { Comment, CommentPage, ContactType, Reply } from "../types/comment";
import { API_COMMENTS } from "../config/api";

const props = defineProps<{ pageId: string }>();

// ============================================================
// 敏感词过滤
// ============================================================
const SENSITIVE_PATTERNS: RegExp[] = [
  /fuck/gi,
  /shit/gi,
  /傻逼/gi,
  /操你/g,
  /草泥马/g,
  /他妈/g,
  /垃圾/g,
  /去死/g,
  /混蛋/g,
  /白痴/g,
  /脑残/g,
];

function filterSensitive(text: string): string {
  let filtered = text;
  for (const pattern of SENSITIVE_PATTERNS) {
    filtered = filtered.replace(pattern, (match) => "*".repeat(match.length));
  }
  return filtered;
}

// 在显示时将已过滤的 *** 高亮为红色
function highlightFiltered(text: string): string {
  return text.replace(/\*{2,}/g, (match) => {
    return `<span class="filtered-word">${match}</span>`;
  });
}

// ============================================================
// 用户信息持久化
// ============================================================
const STORAGE_KEY = `comment_user_${props.pageId}`;

const nickname = ref("");
const contact = ref("");
const contactType = ref<ContactType>("qq");

const contactOptions = [
  { value: "qq" as ContactType, label: "QQ", icon: "💬" },
  { value: "email" as ContactType, label: "邮箱", icon: "✉️" },
  { value: "bilibili" as ContactType, label: "B站", icon: "📺" },
  { value: "website" as ContactType, label: "个人网址", icon: "🌐" },
];

const contactPlaceholder = computed(() => {
  const map: Record<ContactType, string> = {
    qq: "QQ号",
    email: "邮箱地址",
    bilibili: "B站UID或主页链接",
    website: "网址链接",
  };
  return map[contactType.value];
});

const currentUser = computed(() => {
  return nickname.value || null;
});

// ============================================================
// 评论输入
// ============================================================
const content = ref("");
const submitting = ref(false);
const showEmoji = ref(false);
const uploadedImage = ref<string | null>(null);

const emojis = [
  "😀", "😂", "🤣", "😊", "😍", "🤔", "😎", "🙌",
  "👍", "👎", "❤️", "🔥", "🎉", "💪", "✨", "😢",
  "😡", "🤯", "🥳", "😴", "👀", "💯", "🆗", "❓",
];

function toggleEmojiPicker() {
  showEmoji.value = !showEmoji.value;
}

function insertEmoji(emoji: string) {
  content.value += emoji;
  showEmoji.value = false;
}

function onInput() {
  if (content.value.length > 500) {
    content.value = content.value.slice(0, 500);
  }
}

function uploadImage() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("图片大小不能超过 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImage.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

// ============================================================
// 提交评论
// ============================================================
async function submitComment() {
  if (submitting.value || !content.value.trim()) return;
  submitting.value = true;
  try {
    const filteredContent = filterSensitive(content.value);

    const res = await fetch(`${API_COMMENTS}/${props.pageId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nickname: nickname.value,
        contact: contact.value,
        contactType: contactType.value,
        content: filteredContent,
        image: uploadedImage.value,
      }),
    });
    if (!res.ok) throw new Error("提交失败");
    // 清空输入
    content.value = "";
    uploadedImage.value = null;
    // 刷新评论列表
    await fetchComments(1);
  } catch {
    alert("评论提交失败，请重试");
  } finally {
    submitting.value = false;
  }
}

// ============================================================
// 加载评论
// ============================================================
const comments = ref<Comment[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const loading = ref(false);

async function fetchComments(page: number) {
  loading.value = true;
  try {
    const res = await fetch(
      `${API_COMMENTS}/${props.pageId}?page=${page}&limit=10`,
    );
    if (!res.ok) throw new Error("加载失败");
    const data: CommentPage = await res.json();
    comments.value = data.items;
    currentPage.value = data.page;
    totalPages.value = data.totalPages;
  } catch {
    comments.value = [];
  } finally {
    loading.value = false;
  }
}

function goPage(p: number) {
  if (p < 1 || p > totalPages.value) return;
  fetchComments(p);
}

const visiblePages = computed(() => {
  const total = totalPages.value;
  const cur = currentPage.value;
  const pages: number[] = [];
  let start = Math.max(1, cur - 2);
  let end = Math.min(total, cur + 2);
  if (end - start < 4) {
    if (start === 1) end = Math.min(total, start + 4);
    else start = Math.max(1, end - 4);
  }
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});

// ============================================================
// 回复功能
// ============================================================
const replyingTo = ref<string | null>(null);
const replyContent = ref("");
const replySubmitting = ref(false);
const expandedReplies = ref<Record<string, boolean>>({});

function toggleReply(commentId: string) {
  if (replyingTo.value === commentId) {
    replyingTo.value = null;
    replyContent.value = "";
  } else {
    replyingTo.value = commentId;
    replyContent.value = "";
  }
}

function cancelReply() {
  replyingTo.value = null;
  replyContent.value = "";
}

function toggleReplies(commentId: string) {
  expandedReplies.value[commentId] = !expandedReplies.value[commentId];
}

async function submitReply(commentId: string) {
  if (replySubmitting.value || !replyContent.value.trim()) return;
  replySubmitting.value = true;
  try {
    const filteredContent = filterSensitive(replyContent.value);

    const res = await fetch(`${API_COMMENTS}/${props.pageId}/${commentId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nickname: nickname.value,
        contact: contact.value,
        contactType: contactType.value,
        content: filteredContent,
      }),
    });
    if (!res.ok) throw new Error("回复失败");
    // 清空回复输入
    replyContent.value = "";
    replyingTo.value = null;
    // 展开回复并刷新
    expandedReplies.value[commentId] = true;
    await fetchComments(currentPage.value);
  } catch {
    alert("回复失败，请重试");
  } finally {
    replySubmitting.value = false;
  }
}

// ============================================================
// 帮助函数
// ============================================================
function formatTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function getContactIcon(type: string | null): string {
  const map: Record<string, string> = {
    qq: "💬",
    email: "✉️",
    bilibili: "📺",
    website: "🔗",
  };
  return map[type || ""] || "📧";
}

function formatContactUrl(comment: Comment): string {
  if (!comment.contact) return "#";
  switch (comment.contactType) {
    case "qq":
      return `https://wpa.qq.com/msgrd?v=3&uin=${comment.contact}&site=qq&menu=yes`;
    case "email":
      return `mailto:${comment.contact}`;
    case "bilibili":
      return comment.contact.startsWith("http")
        ? comment.contact
        : `https://space.bilibili.com/${comment.contact}`;
    case "website":
      return comment.contact.startsWith("http")
        ? comment.contact
        : `https://${comment.contact}`;
    default:
      return "#";
  }
}

// ============================================================
// 持久化用户信息
// ============================================================
function saveUserInfo() {
  localStorage.setItem(
    `comment_user_info`,
    JSON.stringify({
      nickname: nickname.value,
      contact: contact.value,
      contactType: contactType.value,
    }),
  );
}

watch([nickname, contact, contactType], saveUserInfo, { deep: true });
window.addEventListener("beforeunload", saveUserInfo);

onMounted(() => {
  try {
    const saved = localStorage.getItem("comment_user_info");
    if (saved) {
      const data = JSON.parse(saved);
      nickname.value = data.nickname || "";
      contact.value = data.contact || "";
      contactType.value = data.contactType || "qq";
    }
  } catch {
    /* ignore */
  }
  fetchComments(1);
});

const previewImage = ref<string | null>(null);
</script>

<style scoped>
/* ============================================================
   容器
   ============================================================ */
.comment-container {
  max-width: 1200px;
  margin: 10px auto 0;
  padding: 0 24px 80px;
}

/* ============================================================
   评论表单
   ============================================================ */
.comment-form {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-user-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-row {
  display: flex;
  gap: 12px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 13px;
  color: #333;
  background: #fff;
  outline: none;
  transition: border-color 0.2s ease;
}

.field-input:focus {
  border-color: #3b82f6;
}

.nickname-group {
  flex: 0 0 160px;
}

.contact-group {
  flex: 1;
}

.contact-row {
  display: flex;
  gap: 6px;
}

.contact-type-select {
  display: flex;
  gap: 2px;
  background: #eee;
  border-radius: 8px;
  padding: 2px;
  flex-shrink: 0;
}

.contact-type-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-type-btn.active {
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.contact-input {
  flex: 1;
}

/* 文本输入区 */
.form-input-area {
  position: relative;
}

.comment-textarea {
  width: 100%;
  height: 100px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 13px;
  color: #333;
  background: #fff;
  resize: none;
  outline: none;
  line-height: 1.6;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
  font-family: inherit;
}

.comment-textarea:focus {
  border-color: #3b82f6;
}

.comment-textarea::-webkit-scrollbar {
  width: 4px;
}

.comment-textarea::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 2px;
}

.char-count {
  position: absolute;
  bottom: 8px;
  right: 10px;
  font-size: 11px;
  color: #aaa;
  pointer-events: none;
}

.char-count.warn {
  color: #f59e0b;
}

/* 功能按键 */
.form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.actions-left {
  display: flex;
  gap: 4px;
  position: relative;
}

.action-btn {
  width: 34px;
  height: 34px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  color: #888;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.action-btn:hover {
  background: #eee;
  color: #555;
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 20px;
  border: none;
  background: #1a1a1a;
  color: #fff;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #333;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ============================================================
   表情选择器
   ============================================================ */
.emoji-picker {
  position: absolute;
  top: 40px;
  left: 0;
  width: 220px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  z-index: 10;
}

.emoji-item {
  width: 34px;
  height: 34px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease;
}

.emoji-item:hover {
  background: #f0f0f0;
}

/* ============================================================
   图片预览
   ============================================================ */
.image-preview {
  position: relative;
  display: inline-block;
  margin-top: 8px;
}

.preview-img {
  max-height: 100px;
  border-radius: 8px;
  border: 1px solid #eee;
}

.remove-img {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: #ef5350;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* ============================================================
   评论列表
   ============================================================ */
.comment-list {
  margin-top: 24px;
}

.list-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px 0;
  color: #aaa;
  font-size: 13px;
}

.list-empty svg {
  opacity: 0.4;
}

.comment-item {
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.comment-nickname {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 4px;
}

.comment-contact {
  font-size: 12px;
  color: #3b82f6;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 2px;
}

.comment-contact:hover {
  text-decoration: underline;
}

.comment-time {
  font-size: 11px;
  color: #bbb;
  margin-left: auto;
  font-family: monospace;
}

.comment-body {
  padding-left: 18px;
}

.comment-content {
  font-size: 13px;
  color: #444;
  line-height: 1.6;
  margin: 0 0 6px;
  white-space: pre-wrap;
  word-break: break-word;
}

.comment-image {
  max-height: 150px;
  border-radius: 8px;
  cursor: zoom-in;
  border: 1px solid #eee;
  display: block;
}

/* 回复按钮 */
.comment-actions {
  margin-top: 6px;
}

.reply-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border: none;
  background: transparent;
  color: #999;
  font-size: 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s;
}

.reply-btn:hover {
  background: #f0f0f0;
  color: #3b82f6;
}

/* ============================================================
   回复区域
   ============================================================ */
.replies-area {
  margin-top: 8px;
  padding-left: 18px;
}

.toggle-replies-btn {
  display: inline-block;
  padding: 4px 12px;
  border: none;
  background: #f5f5f5;
  color: #666;
  font-size: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.toggle-replies-btn:hover {
  background: #eee;
  color: #333;
}

.replies-list {
  margin-top: 8px;
  background: #fafafa;
  border-radius: 8px;
  padding: 8px 12px;
  border-left: 2px solid #e0e0e0;
}

.reply-item {
  padding: 8px 0;
}

.reply-item + .reply-item {
  border-top: 1px solid #f0f0f0;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.reply-nickname {
  font-size: 12px;
  font-weight: 600;
  color: #555;
  display: flex;
  align-items: center;
  gap: 3px;
}

.reply-to {
  font-size: 11px;
  color: #bbb;
}

.reply-to-nickname {
  font-size: 12px;
  color: #3b82f6;
}

.reply-time {
  font-size: 10px;
  color: #ccc;
  margin-left: auto;
  font-family: monospace;
}

.reply-content {
  font-size: 13px;
  color: #555;
  line-height: 1.5;
  padding-left: 17px;
  white-space: pre-wrap;
  word-break: break-word;
}

/* ============================================================
   回复输入框
   ============================================================ */
.reply-form {
  margin-top: 8px;
  padding-left: 18px;
}

.reply-form-row {
  display: flex;
  gap: 6px;
}

.reply-input {
  flex: 1;
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}

.reply-input:focus {
  border-color: #3b82f6;
}

.reply-submit-btn {
  padding: 6px 14px;
  background: #1a1a1a;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.reply-submit-btn:hover:not(:disabled) {
  background: #333;
}

.reply-submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reply-cancel-btn {
  padding: 6px 12px;
  background: transparent;
  color: #999;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.reply-cancel-btn:hover {
  background: #f5f5f5;
  color: #666;
}

/* ============================================================
   敏感词高亮
   ============================================================ */
:deep(.filtered-word) {
  color: #ef4444;
  font-weight: 700;
}

/* ============================================================
   分页
   ============================================================ */
.pagination {
  display: flex;
  justify-content: center;
  gap: 4px;
  padding: 16px 0 0;
}

.page-btn {
  min-width: 32px;
  height: 32px;
  border: 1px solid #e0e0e0;
  background: #fff;
  border-radius: 6px;
  font-size: 12px;
  color: #555;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.page-btn:hover:not(:disabled):not(.active) {
  border-color: #bbb;
  background: #f8f8f8;
}

.page-btn.active {
  background: #1a1a1a;
  color: #fff;
  border-color: #1a1a1a;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ============================================================
   图片预览弹窗
   ============================================================ */
.image-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: zoom-out;
}

.overlay-img {
  max-width: 80vw;
  max-height: 80vh;
  border-radius: 8px;
}
</style>

<!-- 非 scoped 样式：穿透 tabler icon 子组件 -->
<style>
.actions-left .action-btn .tabler-icon {
  width: 18px !important;
  height: 18px !important;
  flex-shrink: 0;
}
</style>
