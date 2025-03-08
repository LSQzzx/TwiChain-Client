import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as ed from '@noble/ed25519'
import { sha512 } from '@noble/hashes/sha512'

// 设置 SHA-512 哈希函数
ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m))

export const useAuthStore = defineStore('auth', () => {
  // 从 localStorage 初始化状态
  const user = ref(JSON.parse(localStorage.getItem('user')))
  const isAuthenticated = ref(!!user.value)

  const hexToUint8Array = (hexString) => {
    if (!hexString || typeof hexString !== 'string') {
      throw new Error('Invalid hex string')
    }
    // 确保输入是偶数长度的十六进制字符串
    const cleanHex = hexString.replace('0x', '').trim()
    if (cleanHex.length % 2 !== 0) {
      throw new Error('Hex string must have even length')
    }
    return new Uint8Array(
      cleanHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
    )
  }

  const login = async ({ publicKey, privateKey }) => {
    try {
      // 验证密钥长度
      if (publicKey.length !== 64) {
        throw new Error('Public key must be 64 characters')
      }
      if (privateKey.length !== 128) {
        throw new Error('Private key must be 128 characters')
      }

      // 只取私钥的前32字节(64个字符)作为实际的私钥
      const actualPrivateKey = privateKey.slice(0, 64)
      
      // 转换十六进制字符串为 Uint8Array
      const privateKeyBytes = hexToUint8Array(actualPrivateKey)
      const publicKeyBytes = hexToUint8Array(publicKey)

      // 生成随机消息
      const message = new TextEncoder().encode('login-' + Math.random())
      
      // 使用私钥签名
      const signature = await ed.sign(message, privateKeyBytes)
      
      // 使用公钥验证签名
      const isValid = await ed.verify(signature, message, publicKeyBytes)

      if (isValid) {
        const userData = {
          name: publicKey.slice(0, 8), // 使用公钥前8位作为显示名称
          username: publicKey,
          publicKey,
          privateKey: actualPrivateKey // 只存储实际使用的私钥部分
        }
        user.value = userData
        isAuthenticated.value = true
        // 保存到 localStorage
        localStorage.setItem('user', JSON.stringify(userData))
        return true
      }
      return false
    } catch (error) {
      console.error('登录验证失败:', error)
      return false
    }
  }

  // 添加签名帮助方法
  const signMessage = async (message) => {
    if (!user.value) throw new Error('未登录')
    const messageBytes = new TextEncoder().encode(message)
    const privateKeyBytes = hexToUint8Array(user.value.privateKey)
    const signature = await ed.sign(messageBytes, privateKeyBytes)
    return Buffer.from(signature).toString('hex')
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    // 清除 localStorage
    localStorage.removeItem('user')
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    signMessage
  }
})