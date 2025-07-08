module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/crazy-dom/'  // ⚠️ Usa el nombre de tu repo en GitHub!
    : '/'
}