import './App.css';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import generate from './impgen.js';

var skill_min = 35;
var skill_max = 85;
var zero_skill_bonus = 15;
var bonus_points = 40;
var min_skills = [65, 55, 55, 35, 65, 35, 65, 0, 35, 0];

function Header() {
  return (
    <header>
      <h1>Jagged Alliance 2 IMP Generator</h1>
      <p>Just click the button to get a new set of stats!</p>
      <p>If you're playing Stracciatella make sure you set <code>"pick_skills_directly": true</code> in your <code>game.json</code>.</p>
      <p>If you're playing vanilla, you'll have to follow a guide like <a href="https://fadden.com/gaming/ja2/#quiz">this</a> to get the right skills from the quiz.
        Keep in mind that some traits aren't attainable from the quiz.</p>
      <p>This attempts to give a viable character by adding a minimum amount of points to the skills. The minimums are:<br />
        <code>hp = 65, dex = 55, agi = 55, str = 35, wis = 65, ldr = 35, mrk = 65, exp = 0, med = 35, mec = 0</code><br />
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
  const [[[trait1, trait2], [hp, dex, agi, str, wis, ldr, mrk, exp, med, mec]], settraits] = useState(generate(min_skills, skill_min, skill_max, zero_skill_bonus, bonus_points));
  const { register, getValues } = useForm({
    defaultValues: {
      min_hp: "65",
      min_dex: "55",
      min_agi: "55",
      min_str: "35",
      min_wis: "65",
      min_ldr: "35",
      min_mrk: "65",
      min_exp: "0",
      min_med: "35",
      min_mec: "0"
    }
  });
  return (
    <div className="Skills">
      <form >
        <input type="number" {...register("min_hp", { required: true, valueAsNumber: true })} />
        <input type="number" {...register("min_agi", { required: true, valueAsNumber: true })} />
        <input type="number" {...register("min_dex", { required: true, valueAsNumber: true })} />
        <input type="number" {...register("min_str", { required: true, valueAsNumber: true })} />
        <input type="number" {...register("min_wis", { required: true, valueAsNumber: true })} />
        <input type="number" {...register("min_ldr", { required: true, valueAsNumber: true })} />
        <input type="number" {...register("min_mrk", { required: true, valueAsNumber: true })} />
        <input type="number" {...register("min_exp", { required: true, valueAsNumber: true })} />
        <input type="number" {...register("min_med", { required: true, valueAsNumber: true })} />
        <input type="number" {...register("min_mec", { required: true, valueAsNumber: true })} />
        <input type="button" value="Roll" onClick={() => {
          settraits(generate(getValues(), skill_min, skill_max, zero_skill_bonus, bonus_points));
        }}/>
      </form>
      {trait1}, {trait2}
      <table>
        <tbody>
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
        </tbody>
      </table>
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
