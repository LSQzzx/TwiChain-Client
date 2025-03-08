import { useAuthStore } from '../stores/auth'
import { Buffer } from 'buffer/'

const API_BASE = '/api'
export const MAIN_ADDRESS = '69c5f684026e6bd3e2a8f175a892ca6858cb9936b3c525ce11b981f848a69fc2'

export async function getChain() {
  const response = await fetch(`${API_BASE}/chain`)
  const data = await response.json()
  return data
}

export async function createPost(message, targetPostId = '') {
  const authStore = useAuthStore()
  const signature = await authStore.signMessage(message)

  return createTransaction({
    message,
    signature,
    isLike: false,
    targetPostId
  })
}

export async function likePost(postId) {
  const authStore = useAuthStore()
  // 直接使用帖子ID作为签名对象
  const signature = await authStore.signMessage(postId)

  return createTransaction({
    message: '',
    signature,
    isLike: true,
    targetPostId: postId
  })
}

async function createTransaction({ message, signature, isLike = false, targetPostId = '' }) {
  const authStore = useAuthStore()
  if (!authStore.user) throw new Error('未登录')

  const response = await fetch(`${API_BASE}/transactions/new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sender: authStore.user.publicKey,
      receiver: MAIN_ADDRESS,
      message,
      signature,
      is_like: isLike,
      target_post_id: targetPostId
    })
  })
  return response.json()
}

export function formatTimeAgo(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)

  if (seconds < 60) return '刚刚'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟前`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时前`
  return `${Math.floor(seconds / 86400)}天前`
}

export function parseChainData(chain) {
  const posts = []
  const likes = new Map()
  const comments = new Map()

  chain.chain.forEach(block => {
    block.transactions.forEach(tx => {
      if (tx.receiver === MAIN_ADDRESS) {
        if (!tx.is_like && !tx.target_post_id) {
          // 这是一个主贴
          posts.push({
            id: tx.id,
            content: tx.message,
            timestamp: tx.timestamp,
            name: tx.sender.slice(0, 8),
            username: tx.sender,
            likes: 0,
            comments: 0
          })
        } else if (!tx.is_like && tx.target_post_id) {
          // 这是一个评论
          const currentComments = comments.get(tx.target_post_id) || 0
          comments.set(tx.target_post_id, currentComments + 1)
        } else if (tx.is_like) {
          // 这是一个点赞
          const currentLikes = likes.get(tx.target_post_id) || 0
          likes.set(tx.target_post_id, currentLikes + 1)
        }
      }
    })
  })

  // 添加点赞数和评论数到帖子中
  posts.forEach(post => {
    post.likes = likes.get(post.id) || 0
    post.comments = comments.get(post.id) || 0
  })

  return posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}