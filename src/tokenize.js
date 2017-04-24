import Prism from 'prismjs';
import './prism-lucene';

const grammar = Prism.languages['lucene'];

/**
 * Tokenizes input text
 * @param {string} text
 * @returns {Array}
 */
export default function tokenize(text) {
  return Prism.tokenize(text, grammar);
}
