import React from 'react';

import './Term.css';


const Term = ({ children, contentState, entityKey }) => {
  const data = contentState.getEntity(entityKey).getData();

  return (
    <span>
      <span className="Term-name">
        {children}
      </span>

      {data.synonymsCount &&
        <span className="Term-synonyms">{data.synonymsCount}</span>}
    </span>
  )
};

export default Term;
