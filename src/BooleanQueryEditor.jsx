import React, { PropTypes, Component } from 'react';
import { Editor, getDefaultKeyBinding } from 'draft-js';

import tokenize from './tokenize';
import { noop } from './lib';


class BooleanQueryEditor extends Component {
  static propTypes = {
    editorState: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    onEscape: PropTypes.func,
    onUpArrow: PropTypes.func,
    onDownArrow: PropTypes.func,
    onQueryChange: PropTypes.func,
    handleReturn: PropTypes.func,
    handleQueryReturn: PropTypes.func,
    handlePastedText: PropTypes.func,
    handleKeyCommand: PropTypes.func,
    keyBindingFn: PropTypes.func,
  };

  static defaultProps = {
    onChange: noop,
    onEscape: noop,
    onUpArrow: noop,
    onDownArrow: noop,
    onQueryChange: noop,
    handleReturn: noop,
    handleQueryReturn: noop,
    handlePastedText: noop,
    handleKeyCommand: noop,
    keyBindingFn: noop,
  };

  queryState = null;

  getTermRange = () => {
    const selection = window.getSelection();

    if (selection.rangeCount === 0) {
      return null;
    }

    const range = selection.getRangeAt(0);
    const text = range.startContainer.textContent.trim();
    const end = range.startOffset;
    const start = end - text.length;

    return { start, end, text }
  };

  getQueryState = () => {
    const textRange = this.getTermRange();

    if (textRange === null) {
      return null;
    }

    const tempRange = window.getSelection().getRangeAt(0).cloneRange();
    const startOffset = Math.max(textRange.start, 0);
    tempRange.setStart(tempRange.startContainer, startOffset);
    const rangeRect = tempRange.getBoundingClientRect();
    const text = textRange.text;
    const [token] = tokenize(text);

    this.queryState = {
      text,
      token,
      top: rangeRect.bottom,
      left: rangeRect.left,
      selectedIndex: 0,
    };

    return this.queryState;
  };

  onChange = (editorState) => {
    this.props.onChange(editorState);

    window.requestAnimationFrame(() => {
      this.props.onQueryChange(this.getQueryState());
    });
  };

  onEscape = (e) => {
    if (this.queryState === null) {
      this.props.onEscape(e);

      return 'not-handled';
    }

    e.preventDefault();
    this.queryState = null;
    this.props.onQueryChange(this.queryState);

    return 'handled';
  };

  onArrow = (e, originalEvent, step) => {
    if (this.queryState === null) {
      originalEvent(e);

      return 'handled';
    }

    e.preventDefault();
    this.queryState.selectedIndex += step;
    this.props.onQueryChange(this.queryState);

    return 'handled';
  };

  onUpArrow = (e) => {
    return this.onArrow(e, this.props.onUpArrow, -1);
  };

  onDownArrow = (e) => {
    return this.onArrow(e, this.props.onDownArrow, 1);
  };

  handleReturn = (e) => {
    e.preventDefault();

    if (this.queryState) {
      const { text, selectedIndex } = this.queryState;
      const content = this.props.editorState.getCurrentContent();
      const selection = content.getSelectionAfter();
      const entitySelection = selection.set(
        'anchorOffset', selection.getFocusOffset() - text.length
      );

      this.props.handleQueryReturn(text, selectedIndex, entitySelection);

      this.queryState = null;
      this.props.onQueryChange(this.queryState);
    }

    return 'handled';
  };

  handlePastedText = () => false;

  handleKeyCommand = (command) => {
    this.props.handleKeyCommand(command);
  };

  keyBindingFn = (e) => {
    return this.props.keyBindingFn(e) || getDefaultKeyBinding(e);
  };

  render() {
    const { editorState } = this.props;

    return (
      <Editor
        editorState={editorState}
        onChange={this.onChange}
        onEscape={this.onEscape}
        onUpArrow={this.onUpArrow}
        onDownArrow={this.onDownArrow}
        handleReturn={this.handleReturn}
        handlePastedText={this.handlePastedText}
        handleKeyCommand={this.handleKeyCommand}
        keyBindingFn={this.keyBindingFn}
      />
    );
  }
}

export default BooleanQueryEditor;
