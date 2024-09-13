import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import MainForm from './components/MainForm'
import Topics from './components/Topics';

 
 
function App() {
  return (
  <BrowserRouter>
  <Routes>
    <Route path = '/' element={<MainForm/>}/>
    <Route path = '/topics' element={<Topics/>}/>
  </Routes>
  </BrowserRouter>
  );
}
 
export default App;
 