import React, { useState } from 'react';
import { DataProvider, useData } from './services/DataHandler.jsx';
import Header from './components/Header.jsx';
import Searchbar from './components/Searchbar.jsx';
import CardContainer from './components/CardContainer.jsx';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <DataProvider>
      <div className="container">
        <Header />
        <Searchbar onSearch={setSearchQuery} />
        <CardContainer searchQuery={searchQuery} />
      </div>
    </DataProvider>
  );
}

export default App;
