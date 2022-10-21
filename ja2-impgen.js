import _, { each, map, random, zip } from 'underscore';

// TODO: Support Stracciatella variables for min/max skill range, zero point bonus, and bonus points 

// Min attribute thresholds
var min_hp = 65;
var min_dex = 55;
var min_agi = 55;
var min_str = 35;
var min_wis = 65;
var min_ldr = 35;
// Min skill thresholds
var min_mrk = 65;
var min_exp = 0;
var min_med = 35;
var min_mec = 0;
// Max point pool increased by 90 to account for the attr min of 35
var max_point_pool = 390;

// Trait pool
// TODO: Accommodate 1.13 traits
const trait_pool = ["ambidextrous", "auto weapons", "camouflaged", "electronics",
    "hand-to-hand", "heavy weapons", "knifing", "lockpicking",
    "martial arts", "night ops", "on roof", "stealth",
    "teaching", "throwing"];

// Choose two random traits
// TODO: Allow rolling 1 trait which will results in an expert trait except for electronics, ambidextrous, and camouflaged
function roll_traits() {
    var traits = _.sample(trait_pool, 2);
    return traits;
}

// Increase attribute minimums if certain traits are picked
// TODO: Probably should make this account for other skills
function trait_attr_mins(traits, min_mec, min_mrk) {
    if (_.some(traits, x => x == "electronics" || x == "lockpicking")) {
        min_mec = Math.max(min_mec, 35);
    }
    if (_.some(traits, x => "auto weapons" || x == "heavy weapons")) {
        min_mrk = Math.max(min_mrk, 35);
    }
    return [min_mec, min_mrk];
}

/**
 * Return a randomly chosen list of n positive integers summing to total.
 * Each such list is equally likely to occur.
 * From a stackoverflow post by Mark Dickinson (https://stackoverflow.com/a/3590105)
 */
function constrained_sum_sample_pos(n, total) {

    var dividers = _.sortBy((_.sample(_.range(1, total), n - 1)));
    var result = zip(dividers.concat([total]), [0].concat(dividers));
    return _.map(result, x => _.reduce(x, (a, b) => a - b));
}

/**
 * Return a randomly chosen list of n nonnegative integers summing to total.
 * Each such list is equally likely to occur.
 */
function constrained_sum_sample_nonneg(n, total) {
    return _.map(constrained_sum_sample_pos(n, total + n), x => x - 1);
}

/**
 *  Randomly distribute points to all of the skills.
 * @param {number[]} skills The array of skill values
 * @param {number} points The number of points remaining
 * @returns {number[]} skills The array of skill values 
 * @returns {number} points The number of points remaining
 */
function distribute_skills(skills, points) {
    while (points || _.some(skills, x => x > 65)) { // Keep doing this as long as there are points remaining or if some skills are over cap
        var sample = constrained_sum_sample_nonneg(10, points); // Get 10 numbers that sum to our points
        skills = _.map(_.zip(skills, sample), x => _.reduce(x, (a, b) => a + b)); // Add the random numbers to the skills array
        points = reclaim_points(skills); // Enforce skill min/max and get back any points if necessary
    }
    return [skills, points];
}

/**
 * Checks whether skill values are within range and caps skills where they exceed the upper or lower bounds.
 * @param {number[]} skills The array of skill values
 * @returns {number} The number of points remaining
 */
function reclaim_points(skills) {
    var points_remaining = 0;
    _.each(skills, (n, i) => { // Check each value in the array
        if (n < 15 || n > 65) { // If the number is above or below the skill range then reclaim points
            var m = (n < 15 ? 0 : 65); // Skills below 15 become 0 and are capped at 65
            skills[i] = m;
            points_remaining += n - m;
        }
    })
    return points_remaining;
}

var traits = roll_traits();
[min_mec, min_mrk] = trait_attr_mins(traits, min_mec, min_mrk);
var min_skills = [min_hp, min_dex, min_agi, min_str, min_wis, min_ldr, min_mrk, min_exp, min_med, min_mec];
var skills = [];
min_skills = _.map(min_skills, x => Math.max(x - 20, 0)); // This modifies the skill values to compensate for the 0 points bonus
var points = max_point_pool - _.reduce(min_skills, (memo, num) => memo + num);
[skills, points] = distribute_skills(min_skills, points);
skills =  _.map(skills, x => (x > 15 ? x + 20: 0)); // This modifies the skill values to compensate for the 0 points bonus