const getType  = require('./type-check');

const getValue = (keys, objToSearch) => {
  const key = keys.pop();

  const value = objToSearch[key];
  if (!value) return null;

  const type = getType(value);

  if (type === 'string') return value;
  if (type === 'number') return value;
  
  if (type === 'array') {
    return "~|" + JSON.stringify(value) + "|~";
  }

  return getValue(keys, value);
}

module.exports = (string, contentObj) => {
  const regex = /{{(.*?)}}/gm;

  let r = string;

  if (contentObj) {
    r = string.replace(regex, (m, g1) => {
      const splitKeys = g1.trim().split('.').reverse();
  
      const v = getValue(splitKeys, contentObj);
  
      if (!v) {
        return m
      }
  
      const result = v.replace(/\n/g, "\\n");
      return result;
    });
  }
  
  return r.replace(/~\|/g, '').replace(/\|~/g, '');

}