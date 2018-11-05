module.exports = (o) => {
  if (!o) return null;
  if (Array.isArray(o)) return 'array';
  if (typeof o === 'string') return 'string';
  if (typeof o === 'number') return 'number';
  if (typeof o === 'function') return 'function';

  if (typeof o === 'object') return 'object';
}