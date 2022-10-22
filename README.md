A generator for Jagged Alliance 2 IMP mercenaries
The generator can be found [here](dijidiji.github.io/ja2-impgen/).

This will pick two traits and roll a full set of attributes/skills, adhering to the default point buy system.
If you're playing Stracciatella make sure you set `"pick_skills_directly": true` in your `game.json`.

If you're playing vanilla, you'll have to follow a guide like [this](https://fadden.com/gaming/ja2/#quiz) to get the right skills from the quiz. Keep in mind that some traits aren't attainable from the quiz.

This attempts to give a viable character by adding a minimum amount of points to the skills. The minimums are:
`hp = 65, dex = 55, agi = 55, str = 35, wis = 65, ldr = 35, mrk = 65, exp = 0, med = 35, mec = 0`
However, if electronics or lockpicking are rolled, `mec = 35` and if auto/heavy weapons are rolled, `mrk = 35` to ensure these traits are useful.

In the future these minimums will be configurable on the page.