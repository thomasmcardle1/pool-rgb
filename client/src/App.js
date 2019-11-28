import React from 'react';
import logo from './logo.svg';
import './App.css';
import CustomNav from './components/CustomNav';
import Main from './components/Main';
import CurrentModeBar from './components/CurrentMode';


function App() {
  return (
    <div className="App">
      <CustomNav />
      <CurrentModeBar />
      <div className="container">
        <Main />
      </div>
      <footer className="pt-5"></footer>
    </div>
  );
}

export default App;
