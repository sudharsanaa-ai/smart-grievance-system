/**
 * Simple keyword-based similarity detection
 */

const stopWords = new Set(['a', 'an', 'the', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'with', 'and', 'or', 'of', 'issue', 'problem', 'complaint']);

const getKeywords = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
};

const checkSimilarity = (subject1, subject2) => {
  const words1 = new Set(getKeywords(subject1));
  const words2 = new Set(getKeywords(subject2));

  if (words1.size === 0 || words2.size === 0) return false;

  let intersection = 0;
  for (const word of words1) {
    if (words2.has(word)) {
      intersection++;
    }
  }

  // If they share at least 2 significant keywords, or more than 50% of keywords in the shorter string
  const minWords = Math.min(words1.size, words2.size);
  const similarityScore = intersection / minWords;

  return intersection >= 2 || similarityScore >= 0.5;
};

module.exports = { checkSimilarity };
