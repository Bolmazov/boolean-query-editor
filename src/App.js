import React, { Component } from 'react';
import { EditorState, Modifier, CompositeDecorator } from 'draft-js';

import QueryEditor, { normalizeSelectedIndex } from './QueryEditor';


const styles = {
  synonyms: {
    margin: '0 5px',
    padding: '1px 4px 2px',
    fontSize: '10px',
    lineHeight: 1.2,
    borderRadius: '2px',
    background: '#cee4b0',
  }
};

const skills = [{
  id: 'java',
  name: 'Java',
  synonymsCount: 131,
}, {
  id: 'javascript',
  name: 'JavaScript',
  synonymsCount: 25,
}, {
  id: 'python',
  name: 'Python',
  synonymsCount: 57,
}, {
  id: 'ruby',
  name: 'Ruby',
  synonymsCount: 19,
}, {
  id: 'react.js',
  name: 'React.js',
  synonymsCount: 3,
}, {
  id: 'angular',
  name: 'Angular',
  synonymsCount: 7,
}, {
  id: 'postgres',
  name: 'Postgres',
  synonymsCount: 11,
}, {
  id: 'mysql',
  name: 'MySQL',
  synonymsCount: 20,
}, {
  id: 'hadoop',
  name: 'Hadoop',
  synonymsCount: 8,
}, {
  id: 'hbase',
  name: 'HBase',
  synonymsCount: 8,
}, {
  id: 'couchdb',
  name: 'CouchDB',
  synonymsCount: 2,
}, {
  id: 'machine learning',
  name: 'Machine Learning',
  synonymsCount: 13,
}, {
  id: 'real time',
  name: 'Real Time',
  synonymsCount: 4,
}];

const Term = (props) => {
  const { children, contentState, entityKey } = props;
  const data = contentState.getEntity(entityKey).getData();

  return (
    <span>
      <span style={{ fontWeight: 700 }}>{children}</span>
      {data.synonymsCount &&
        <span style={styles.synonyms}>{data.synonymsCount}</span>}
    </span>
  )
};

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

const decorator = new CompositeDecorator([{
  strategy,
  component: Term,
}]);

const Suggestions = ({ top, left, text, selectedIndex }) => {
  const listStyle = {
    top,
    left,
    position: 'absolute',
    padding: '0px',
    margin: '0px',
    listStyle: 'none outside none',
    background: 'white',
    border: '1px solid rgba(0, 0, 0, .1)',
    borderRadius: 3,
    boxShadow: '0 0 0 1px rgba(0, 0, 0, .1), 0 1px 10px rgba(0, 0, 0, .35)',
  };
  const suggests = skills.filter(({ name }) => name.toLowerCase().includes(text.toLowerCase()));
  const index = normalizeSelectedIndex(selectedIndex, suggests.length);

  if (suggests.length === 0) return <div />;

  return (
    <ul style={listStyle}>
      {suggests.map(({ id, name }, i) => (
        <li key={id} style={{ background: index === i + 1 ? '#e78162' : 'transparent' }}>
          {name}
        </li>
      ))}
    </ul>
  );
};

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
      ' OR ',
      null,
      operatorEntityKey
    );

    return EditorState.push(
      editorState,
      contentStateWithOperator,
      'apply-entity',
    );
  };

  handleQueryReturn = (text, selectedIndex, selection) => {
    this.setState({
      editorState: this.insertDefaultOperator(this.applyTermEntity(text, selectedIndex, selection))
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
    const editorStyle = {
      maxWidth: '600px',
      minHeight: '38px',
      margin: '7px 12px',
      padding: '7px',
      border: '1px solid rgba(0, 0, 0, .1)',
      fontFamily: 'monospace',
    };

    return (
      <div>
        {this.renderSuggestions()}

        <div style={editorStyle}>
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
