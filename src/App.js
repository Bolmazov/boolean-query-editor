import React, { Component } from 'react';
import { EditorState, Modifier } from 'draft-js';
import flowRight from 'lodash.flowright';

import decorator from './decorator';
import QueryEditor, { normalizeSelectedIndex } from './QueryEditor';
import Suggestions, { skills } from './Suggestions';
import './App.css';


class App extends Component {
  state = {
    editorState: EditorState.createEmpty(decorator),
    queryState: null,
  };

  componentDidMount() {
    this.ref.focus();
  }

  onChange = (editorState) => {
    this.setState({ editorState });
  };

  onQueryChange = (queryState) => {
    this.setState({ queryState });
  };

  applyTermEntity = (text, selectedIndex, selection) => {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    const suggests = skills.filter(({ name }) => name.toLowerCase().includes(text.toLowerCase()));
    const index = normalizeSelectedIndex(selectedIndex, suggests.length) - 1;
    const termData = suggests[index] || { id: text, name: text };
    const contentStateWithTermEntity = contentState.createEntity(
      'TERM',
      'MUTABLE',
      termData
    );
    const termEntityKey = contentStateWithTermEntity.getLastCreatedEntityKey();
    const contentStateWithTerm = Modifier.replaceText(
      contentState,
      selection,
      termData.name,
      null,
      termEntityKey
    );

    return EditorState.push(
      editorState,
      contentStateWithTerm,
      'apply-entity'
    );
  };

  insertDefaultOperator = (editorState) => {
    const contentState = editorState.getCurrentContent();
    const selection = contentState.getSelectionAfter();
    const contentStateWithOperatorEntity = contentState.createEntity(
      'OPERATOR',
      'IMMUTABLE'
    );
    const operatorEntityKey = contentStateWithOperatorEntity.getLastCreatedEntityKey();
    const contentStateWithOperator = Modifier.insertText(
      contentState,
      selection,
      'OR',
      null,
      operatorEntityKey
    );

    return EditorState.push(
      editorState,
      contentStateWithOperator,
      'apply-entity',
    );
  };

  insertSpace = (editorState) => {
    const contentState = editorState.getCurrentContent();
    const selection = contentState.getSelectionAfter();
    const contentStateWithSpaceEntity = contentState.createEntity(
      'SPACE',
      'IMMUTABLE'
    );
    const spaceEntityKey = contentStateWithSpaceEntity.getLastCreatedEntityKey();
    const contentStateWithSpace = Modifier.insertText(
      contentState,
      selection,
      ' ',
      null,
      spaceEntityKey
    );

    return EditorState.push(
      editorState,
      contentStateWithSpace,
      'apply-entity',
    );
  };

  addTerm = flowRight([
    this.insertSpace,
    this.insertDefaultOperator,
    this.insertSpace,
    this.applyTermEntity
  ]);

  handleQueryReturn = (text, selectedIndex, selection) => {
    this.setState({
      editorState: this.addTerm(text, selectedIndex, selection),
    });
  };

  renderSuggestions() {
    const { queryState } = this.state;

    if (queryState && queryState.text) {
      return <Suggestions {...queryState} />;
    }

    return null;
  }

  render() {
    return (
      <div>
        {this.renderSuggestions()}

        <div className="App-editor">
          <QueryEditor
            ref={(ref) => { this.ref = ref; }}
            editorState={this.state.editorState}
            onChange={this.onChange}
            onQueryChange={this.onQueryChange}
            handleQueryReturn={this.handleQueryReturn}
          />
        </div>
      </div>
    );
  }
}

export default App;
