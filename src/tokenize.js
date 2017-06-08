import Prism from 'prismjs';
import './prism-boolean';

const grammar = Prism.languages['boolean'];

/**
 * Tokenizes input text
 * @param {string} text
 * @returns {Array}
 */
export default function tokenize(text) {
  return Prism.tokenize(text, grammar);
}
