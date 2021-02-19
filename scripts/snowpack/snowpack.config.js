module.exports = {
  exclude: ['**/node_modules/**/*', '**/scripts/**/*.mjs'],
  plugins: ['@snowpack/plugin-react-refresh'],
  routes: [{ match: 'routes', src: '.*', public: '/', dest: 'public/index.html' }],
}

console.log(process.env)
