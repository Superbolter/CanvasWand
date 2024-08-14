import React from 'react'
import CanvasComponent from './Canvas'
import Cookies from "universal-cookie";
import { Toaster } from 'react-hot-toast';

export const cookies = new Cookies();
const App = () => {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <CanvasComponent/>
    </div>
  )
}

export default App
