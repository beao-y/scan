type TokenUpdateCallback = (newToken: string) => void

class TokenEventCenter {
  private static instance: TokenEventCenter
  private callbacks: TokenUpdateCallback[] = []

  // 单例模式
  public static getInstance(): TokenEventCenter {
    if (!TokenEventCenter.instance) {
      TokenEventCenter.instance = new TokenEventCenter()
    }
    return TokenEventCenter.instance
  }

  // 注册监听
  onTokenUpdate(callback: TokenUpdateCallback) {
    this.callbacks.push(callback)
  }

  // 触发更新token
  emitTokenUpdate(newToken: string) {
    this.callbacks.forEach(cb => cb(newToken))
  }

  // 触发更新refreshToken
  emitRefreshTokenUpdate(newRefreshToken: string) {
    this.callbacks.forEach(cb => cb(newRefreshToken))
  }
}

export const tokenNotifier = TokenEventCenter.getInstance()
