import React from 'react'
import CanvasComponent from './Canvas'
import Cookies from "universal-cookie";

export const cookies = new Cookies();
const App = () => {
  return (
    <div>
      <CanvasComponent/>
    </div>
  )
}

export default App
