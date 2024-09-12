import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import MainForm from './components/MainForm'
 
 
function App() {
  return (
  <BrowserRouter>
  <Routes>
    <Route path = '/' element={<MainForm/>}/>
  </Routes>
  </BrowserRouter>
  );
}
 
export default App;
 