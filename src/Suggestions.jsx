import React from 'react';

import { normalizeSelectedIndex } from './lib';
import './Suggestions.css';

export const skills = [{
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

const Suggestions = ({ top, left, text, selectedIndex }) => {
  const listStyle = {
    top,
    left,
  };
  const suggests = skills.filter(({ name }) => name.toLowerCase().includes(text.toLowerCase()));
  const index = normalizeSelectedIndex(selectedIndex, suggests.length);

  if (suggests.length === 0) return <div />;

  return (
    <ul className="Suggestions-list" style={listStyle}>
      {suggests.map(({ id, name }, i) => (
        <li key={id} style={{ background: index === i + 1 ? '#e78162' : 'transparent' }}>
          {name}
        </li>
      ))}
    </ul>
  );
};

export default Suggestions;
