A generator for Jagged Alliance 2 IMP mercenaries
The generator can be found [here](dijidiji.github.io/ja2-impgen/).

This will pick two traits and roll a full set of attributes/skills, adhering to the default point buy system.
If you're playing Stracciatella make sure you set `"pick_skills_directly": true` in your `game.json`.

If you're playing vanilla, you'll have to follow a guide like [this](https://fadden.com/gaming/ja2/#quiz) to get the right skills from the quiz. Keep in mind that some traits aren't attainable from the quiz.

You can configure your desired minimum stats if you want to skew the generation in a given way.
However, if electronics or lockpicking are rolled, the minimum <b>mec</b> score is prevented from being 0 and if auto/heavy weapons are rolled, the minimum <b>mrk</b> is prevented from being 0.This is to ensure you can actually use these traits.
