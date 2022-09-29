# ja2-impgen
A generator for Jagged Alliance 2 IMP mercenaries

Only available as a script for now. This will pick two traits and roll a full set of attributes/skills for use in JA2. The vanilla IMP personality quiz isn't supported right now (because I couldn't figure it out yet). If using Stracciatella, set `"pick_skills_directly": true` in `game.json`

At the top of the script you'll find some variables which set the minimum for attributes. Currently, if the electronics or lockpicking traits are picked, the minimum mechanics (`min_mec`) is set to at least 35. Similarly, if auto weapons or heavy weapons are picked, the minimum marksmanship (`min_mrk`) is set to at least 35 (note that this is way too low to be useful, I was tired).

Sometimes the script gets stuck. I dunno.

The end result should be a neatly printed output like this (ignore all the debug strings that are printed before it)
────────────────────
camouflaged
martial arts
────────────────────
HP      71
DEX     68
AGI     61
STR     47
WIS     85
LDR     47
MRK     66
EXP     42
MED     46
MEC     57
