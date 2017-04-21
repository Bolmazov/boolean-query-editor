import Prism from 'prismjs';
import './prism-lucene';

const grammar = Prism.languages['lucene'];

export default function tokenize(text) {
  return Prism.tokenize(text, grammar);
}
