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

function hackSvgProxyForGhPages() {
  getFilesFolders(path.join(path.resolve(), 'build/dist')).forEach((file) => {
    // TODO: Figure out how to get this to work property in GitHub pages or Snowpack
    if (file.includes('svg.proxy.js')) {
      let fileString = fs.readFileSync(file).toString()
      if (fileString.includes('export default "/dist/')) {
        fileString = fileString.replace(/export default "\/dist/g, 'export default "/react-snowpack/dist')
        fs.writeFileSync(file, fileString)
      }
    }
  })
}

hackSvgProxyForGhPages()
