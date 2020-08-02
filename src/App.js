import React from 'react';
import './App.css';
import AirportChooser from './AirportChooserComponent/AirportChooser';

function App() {
  let urlForFetchingAirportList = 'https://gist.githubusercontent.com/tdreyno/4278655/raw/7b0762c09b519f40397e4c3e100b097d861f5588/airports.json';

  return (
    <div className="App">
        <AirportChooser url={urlForFetchingAirportList}></AirportChooser>
    </div>
  );
}

export default App;
