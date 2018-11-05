const isProd = process.env.NODE_ENV === 'production';

module.exports = () => {
  if (isProd) {
    return __non_webpack_require__;
  } else {
    return require;
  }
}