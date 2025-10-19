interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async checkLimit(key: string): Promise<boolean> {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    // Get existing requests for this key
    let timestamps = this.requests.get(key) || [];
    
    // Remove old timestamps
    timestamps = timestamps.filter(time => time > windowStart);
    
    // Check if we're over the limit
    if (timestamps.length >= this.config.maxRequests) {
      return false;
    }
    
    // Add new timestamp
    timestamps.push(now);
    this.requests.set(key, timestamps);
    
    return true;
  }

  async waitForSlot(key: string): Promise<void> {
    while (!(await this.checkLimit(key))) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}