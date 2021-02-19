import React from 'react'
import { render } from 'react-dom'
import Button from './Button'

render(
  <React.StrictMode>
    <Button>Foo</Button>
  </React.StrictMode>,
  document.getElementById('root')
)
