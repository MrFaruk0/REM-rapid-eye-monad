// Token counter utility — günlük token limitini takip eder
const DAILY_TOKEN_LIMIT = 500;

let totalTokens = 0;

export const tokenCounter = {
  addTokens(n) {
    totalTokens += n;
    return totalTokens;
  },
  getTotal() {
    return totalTokens;
  },
  getLimit() {
    return DAILY_TOKEN_LIMIT;
  },
  getPercent() {
    return Math.min((totalTokens / DAILY_TOKEN_LIMIT) * 100, 100);
  },
  isLimitReached() {
    return totalTokens >= DAILY_TOKEN_LIMIT;
  },
  reset() {
    totalTokens = 0;
  },
};
