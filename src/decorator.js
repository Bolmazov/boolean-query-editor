import React from 'react';
import Immutable from 'immutable';
import { CompositeDecorator } from 'draft-js';
import MultiDecorator from 'draft-js-multidecorators';
import tokenize from './tokenize';
import Term from './Term';
import 'prismjs/themes/prism.css';


function occupySlice(targetArr, start, end, componentKey) {
  for (let ii = start; ii < end; ii++) {
    targetArr[ii] = componentKey;
  }
}

class Decorator {
  highlighted = {};

  getDecorations = (block) => {
    const blockKey = block.getKey();
    const blockText = block.getText();
    const decorations = new Array(blockText.length).fill(null);
    const tokens = tokenize(blockText);
    let offset = 0;

    this.highlighted[blockKey] = {};

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (typeof token === 'string') {
        offset += token.length;
      } else {
        const tokenId = 'tok' + offset;
        const resultId = blockKey + '-' + tokenId;

        this.highlighted[blockKey][tokenId] = token;

        occupySlice(decorations, offset, offset + token.content.length, resultId);
        offset += token.content.length;
      }
    }

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

function strategy(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();

      if (entityKey === null) {
        return false;
      }

      return contentState.getEntity(entityKey).getType() === 'TERM';
    },
    callback
  );
}

export default new MultiDecorator([
  new Decorator(),
  new CompositeDecorator([{
    strategy,
    component: Term,
  }])
]);
