import './App.css';
import { useState } from 'react';
import generate from './impgen.js';

function Header() {
  return (
    <header>
      <h1>Jagged Alliance 2 IMP Generator</h1>
      <p>Just click the button to get a new set of stats!</p>
      <p>If you're playing Stracciatella make sure you set <code>"pick_skills_directly": true</code> in your <code>game.json</code>.</p>
      <p>If you're playing vanilla, you'll have to follow a guide like <a href="https://fadden.com/gaming/ja2/#quiz">this</a> to get the right skills from the quiz.
      Keep in mind that some traits aren't attainable from the quiz.</p>
      <p>This attempts to give a viable character by adding a minimum amount of points to the skills. The minimums are:<br/>
      <code>hp = 65, dex = 55, agi = 55, str = 35, wis = 65, ldr = 35, mrk = 65, exp = 0, med = 35, mec = 0</code><br/>
      However, if electronics or lockpicking are rolled, <code>mec = 35</code> and if auto/heavy weapons are rolled, <code>mrk = 35</code> to ensure these traits are useful.</p>
      <p><small>Currently doesn't include the additional 1.13 traits.</small></p>
    </header>
  );
}

function Footer() {
  return (
  <footer>
    <address><a href="https://github.com/dijidiji/ja2-impgen">See the source code at GitHub</a></address>
  </footer>
  );
}

function ImpGen() {
  const [[[trait1, trait2], [hp, dex, agi, str, wis, ldr, mrk, exp, med, mec]], settraits] = useState(generate());
  return (
    <div className="Skills">
      {trait1}, {trait2}
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
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Header />
      <ImpGen />
      <Footer />
    </div>
  );
}

export default App;
