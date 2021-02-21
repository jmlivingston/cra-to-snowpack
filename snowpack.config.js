const isProd = process.argv.find((arg) => arg.includes('--dest=')).split('=')[1] === 'prod'

module.exports = {
  buildOptions: {
    baseUrl: isProd ? '/react-snowpack' : '/',
  },
  exclude: ['**/setupTests.js'],
  mount: {
    public: {
      url: '/',
      static: true,
    },
    src: {
      url: isProd ? '/react-snowpack' : '/',
    },
  },
  plugins: ['@snowpack/plugin-react-refresh'],
}
