const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

const getFilesFolders = (dir) =>
  fs.readdirSync(dir).reduce((files, file) => {
    const name = path.join(dir, file)
    const isDirectory = fs.statSync(name).isDirectory()
    const fileFolder = isDirectory ? [] : [name]
    const fileFolders = isDirectory ? getFilesFolders(name) : []
    return [...files, ...fileFolder, ...fileFolders]
  }, [])

console.log('Installing cross-env, snowpack, and @snowpack/plugin-react-refresh as dev dependencies')
exec('npm i cross-env snowpack @snowpack/plugin-react-refresh -D')

console.log('Update package.json npm scripts and snowpack config')
const packageJsonPath = path.join(path.resolve(), 'package.json')
let packageJsonString = fs.readFileSync(packageJsonPath).toString()
packageJsonString = packageJsonString.replace(
  '"react-scripts start"',
  '"cross-env REACT_APP_MODE=true react-scripts start"'
)
packageJsonString = packageJsonString.replace(
  '"react-scripts build"',
  '"cross-env REACT_APP_MODE=true react-scripts build"'
)
let packageJson = JSON.parse(packageJsonString)
packageJson.scripts['start-snowpack'] = 'snowpack dev'
packageJson.scripts['build-snowpack'] = 'snowpack build'
packageJson.scripts['build-serve'] = 'npx http-server build -o'
packageJson.snowpack = {
  baseOptions: {
    baseUrl: './',
  },
  exclude: ['**/setupTests.js'],
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  plugins: ['@snowpack/plugin-react-refresh'],
}

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

console.log('Update file extensions from .js to .jsx')
getFilesFolders(path.join(path.resolve(), 'src')).forEach((file) => {
  // TODO: Probably not the best way to detect if a .js file is using .jsx.
  if (path.extname(file) === '.js' && !file.includes('.test.js')) {
    let fileString = fs.readFileSync(file).toString()
    if (fileString.includes('<')) {
      const basename = path.basename(file, path.extname(file))
      const newFile = path.join(path.dirname(file), basename + '.jsx')
      fs.renameSync(file, newFile)
    }
  }
})

console.log('Ensure React is getting imported')
getFilesFolders(path.join(path.resolve(), 'src')).forEach((file) => {
  // TODO: Checking for react import should be handled through an AST package like jscodesmith or acorn.
  if (path.extname(file) === '.jsx') {
    let fileString = fs.readFileSync(file).toString()
    if (!fileString.includes('import React ')) {
      fileString = `import React from 'react'
${fileString}`
      fs.writeFileSync(file, fileString)
    }
  }
})

console.log('Update index.html PUBLIC_URL references and add Snowpack script entry')
const indexHtmlPath = path.join(path.resolve(), 'public/index.html')
let indexHtml = fs.readFileSync(indexHtmlPath).toString()
indexHtml = indexHtml.replace(/"%PUBLIC_URL%/g, '".%PUBLIC_URL%')
if (!indexHtml.includes('REACT_APP_MODE')) {
  const code = `  <script type="module">
      if ('%REACT_APP_MODE%' !== 'true') import('/dist/index.js')
    </script>
  </body>`
  indexHtml = indexHtml.replace('</body>', code)
}
fs.writeFileSync(indexHtmlPath, indexHtml)
