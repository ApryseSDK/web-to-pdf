const React = require('react');
const getType = require('./type-check'); 

const TYPES = {
  REACT_COMPONENT: "REACT_COMPONENT",
  CUSTOM_FUNCTION: "CUSTOM_FUNCTION",
  HTML_STRING: "HTML_STRING",
  HTML_FILE: "HTML_FILE"
}

module.exports = (Input, obj) => {
  const type = getType(Input);
  
  if (type === 'function') {

    try {
      let funcOutput = Input(obj);
      let funcOutputType = getType(funcOutput);
      if (funcOutputType === 'string' || funcOutput.then) {
        return TYPES.CUSTOM_FUNCTION;
      }
    } catch (e) {
      // Not a custom function
    }

    const isReact = React.isValidElement(<Input />);
    if (isReact) {
      return TYPES.REACT_COMPONENT;
    }

  }

  if (type === 'string') {
    Input = Input.trim();

    if (Input.startsWith('<')) {
      return TYPES.HTML_STRING;
    }

    if (Input.endsWith('.html')) {
      return TYPES.HTML_FILE;
    }

  }
}

module.exports.TYPES = TYPES;