import logo from './logo.svg';
import './App.css';
import _, { random } from 'underscore';
import { useState } from 'react';
import generate from './impgen.js';

function Traits() {
  const [[[trait1, trait2], [hp, dex, agi, str, wis, ldr, mrk, exp, med, mec]], settraits] = useState(generate());
  return (
    <>
      <p>{trait1}, {trait2}</p>
      <table>
        <tr>
          <td>hp</td>
          <td>{hp}</td>
        </tr>
        <tr>
          <td>dex</td>
          <td>{dex}</td>
        </tr>
        <tr>
          <td>agi</td>
          <td>{agi}</td>
        </tr>
        <tr>
          <td>str</td>
          <td>{str}</td>
        </tr>
        <tr>
          <td>wis</td>
          <td>{wis}</td>
        </tr>
        <tr>
          <td>ldr</td>
          <td>{ldr}</td>
        </tr>
        <tr>
          <td>mrk</td>
          <td>{mrk}</td>
        </tr>
        <tr>
          <td>exp</td>
          <td>{exp}</td>
        </tr>
        <tr>
          <td>med</td>
          <td>{med}</td>
        </tr>
        <tr>
          <td>mec</td>
          <td>{mec}</td>
        </tr>
      </table>
      <button onClick={() => {
        settraits(generate());
      }}>Roll</button>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Traits />
      </header>
    </div>
  );
}

export default App;
