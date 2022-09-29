import io from 'socket.io-client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Join from './components/Join';


const socket = io.connect("http://localhost:5000");

function App() {
  return (
    <BrowserRouter> 
      <Routes> 
        <Route path="/" element={<Join />} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
