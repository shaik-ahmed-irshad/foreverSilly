class RateLimiter {
  constructor(maxRequests = 50, timeWindow = 60000) { // 50 requests per minute (OpenRouter free tier is much more generous)
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }

  async waitForSlot() {
    const now = Date.now();
    
    // Remove old requests outside the time window
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    // If we've hit the limit, wait
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.timeWindow - (now - oldestRequest);
      
      if (waitTime > 0) {
        console.log(`Rate limit reached. Waiting ${Math.ceil(waitTime / 1000)} seconds...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    // Add current request
    this.requests.push(now);
  }

  async execute(fn) {
    await this.waitForSlot();
    return fn();
  }
}

// Create a global rate limiter for OpenRouter API (much more generous than Gemini)
const geminiRateLimiter = new RateLimiter(30, 60000); // 30 requests per minute to be safe

module.exports = {
  RateLimiter,
  geminiRateLimiter
}; 