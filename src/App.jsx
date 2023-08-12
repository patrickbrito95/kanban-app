import React from 'react';
import './App.css';
import Board from './components/Board';

const App = () => {
  return (
    <div className="app">
      <h1 className='title-board'>Tarefas</h1>
      <Board />
    </div>
  );
};

export default App;
