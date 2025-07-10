import logo from './logo.svg';
import './App.css';
import React from 'react';
import {Routes, Route} from 'react-router-dom';
import { Signup, Login } from './pages';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
    < Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
    </div>
  );
}

export default App;
