// import fs from 'fs'
// import path from 'path'

const fs = require('fs')
const path = require('path')

fs.writeFileSync(
  path.join(path.resolve(), 'build/index.html'),
  '<meta http-equiv="refresh" content="0; url=public/index.html" />'
)
