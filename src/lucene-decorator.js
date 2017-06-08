import React from 'react';
import Immutable from 'immutable';
import tokenize from './tokenize';
// import 'prismjs/themes/prism.css';


function occupySlice(targetArr, start, end, componentKey) {
  for (let ii = start; ii < end; ii++) {
    targetArr[ii] = componentKey;
  }
}

class LuceneDecorator {
  highlighted = {};

  getDecorations = (block) => {
    const blockKey = block.getKey();
    const blockText = block.getText();
    const decorations = new Array(blockText.length).fill(null);
    const tokens = tokenize(blockText);
    let offset = 0;

    this.highlighted[blockKey] = {};

    tokens.forEach((token) => {
      if (typeof token === 'string') {
        offset += token.length;
      } else {
        const tokenId = 'tok' + offset;
        const resultId = blockKey + '-' + tokenId;

        this.highlighted[blockKey][tokenId] = token;

        occupySlice(decorations, offset, offset + token.content.length, resultId);
        offset += token.content.length;
      }
    });

    return Immutable.List(decorations);
  };

  getComponentForKey = () => ({ type, children }) => {
    const props = {
      className: `prism-token token ${type}`
    };

    return React.createElement(
      'span',
      props,
      children
    );
  };

  getPropsForKey = (key) => {
    const parts = key.split('-');
    const blockKey = parts[0];
    const tokId = parts[1];
    const token = this.highlighted[blockKey][tokId];

    return {
      type: token.type
    };
  };
}

export default LuceneDecorator;
