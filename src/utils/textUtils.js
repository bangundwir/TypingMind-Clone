// utils/textUtils.js
export const countWords = (text) => {
  return text.trim().split(/\s+/).length;
};

export const estimateTokens = (text) => {
  // This is a very rough estimation. In reality, tokenization is more complex.
  return Math.ceil(text.length / 4);
};