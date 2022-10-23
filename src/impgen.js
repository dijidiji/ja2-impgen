import _ from 'underscore';

// TODO: Support Stracciatella variables for min/max skill range, zero point bonus, and bonus points 
// TODO: Accommodate 1.13 trait changes

/*
// The points you receive for setting a skill to 0.
var zero_skill_bonus = 15;
var bonus_points = 40;
// Min/max for skills
var skill_min = 35;
var skill_max = 85;
// Min attribute thresholds
var min_hp = 0;
var min_dex = 0;
var min_agi = 0;
var min_str = 0;
var min_wis = 0;
var min_ldr = 0;
// Min skill thresholds
var min_mrk = 0;
var min_exp = 0;
var min_med = 0;
var min_mec = 0;
*/

/**
 * Calculates the number of points available for skills.
 * In vanilla, with all skills at minimum you have 300 points to spend.
 * This is calculated by the default skill value - skill minimum * 10
 * + zero skill bonus * 10 + bonus points.
 * The default skill value is the minimum of 55 and the max skill value.
 */
function calculate_point_pool(skill_min, skill_max, zero_skill_bonus, bonus_points) {
    return ((Math.min(skill_max, 55) - skill_min) * 10 + zero_skill_bonus * 10 + bonus_points);
}

// Trait pool
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
function set_trait_attr_mins(traits, min_skills) {
    if (_.some(traits, x => x === "electronics" || x === "lockpicking")) {
        min_skills[9] = Math.max(min_skills[9], 35); 
    }
    if (_.some(traits, x => "auto weapons" || x === "heavy weapons")) {
        min_skills[6] = Math.max(min_skills[6], 35);
    }
}

/**
 * Return a randomly chosen list of n positive integers summing to total.
 * Each such list is equally likely to occur.
 * From a stackoverflow post by Mark Dickinson (https://stackoverflow.com/a/3590105)
 */
function constrained_sum_sample_pos(n, total) {
    var dividers = _.sortBy((_.sample(_.range(1, total), n - 1)));
    var result = _.zip(dividers.concat([total]), [0].concat(dividers));
    return _.map(result, x => _.reduce(x, (a, b) => a - b));
}

/**
 * Return a randomly chosen list of n nonnegative integers summing to total.
 * Each such list is equally likely to occur.
 * From a stackoverflow post by Mark Dickinson (https://stackoverflow.com/a/3590105)
 */
function constrained_sum_sample_nonneg(n, total) {
    return _.map(constrained_sum_sample_pos(n, total + n), x => x - 1);
}

/**
 * Randomly distribute points to all of the skills.
 * @param {number[]} skills The array of skill values
 * @param {number} points The number of points remaining
 * @returns {number[]} skills The array of skill values 
 * @returns {number} points The number of points remaining
 */
function distribute_skills(skills, points, min_points, max_points) {
    while (points || _.some(skills, x => x > max_points)) { // Keep doing this as long as there are points remaining or if some skills are over cap
        var sample = constrained_sum_sample_nonneg(10, points); // Get 10 numbers (1 for each skill) that sum to our points
        skills = _.map(_.zip(skills, sample), x => _.reduce(x, (a, b) => a + b)); // Sum each number in the sample and the skill value
        points = reclaim_points(skills, min_points, max_points); // Enforce skill min/max and get back any points if necessary
    }
    return skills;
}

/**
 * Checks whether point values are within range, then enforces the minimum and maximum.
 * If a value is modified then points are reclaimed for redistribution.
 * @param {number[]} skills The array of skill values
 * @returns {number} The number of points remaining
 */
function reclaim_points(skills, min_points, max_points) {
    var points_remaining = 0;
    _.each(skills, (n, i) => { // Check each value in the array
        if (n < min_points || n > max_points) { // If the number is above or below the skill range then reclaim points
            var m = (n < min_points ? 0 : max_points); // Set skills below the min to 0 and cap any that exceed the max
            skills[i] = m;
            points_remaining += n - m;
        }
    })
    return points_remaining;
}

/**
 * Converts skill values to point values.
 * Due to the zero skill bonus, the number of points spent is not the same as the skill value.
 * A skill of 55 only has 35 points spent if using the vanilla values.
 * This is calculated by the zero skill bonus + the difference between the current skill and the minimum skill threshold.
 * If the value is 0 then it remains at 0 points.
 * e.g. with a 20 point bonus and a minimum of 35, a skill of 55 has 20+55-35=40 points invested.
 * @param {*} number 
 * @param {*} zero_skill_bonus 
 * @param {*} skill_min 
 * @returns The number converted to points.
 */
function convert_to_points(number, skill_min, zero_skill_bonus) {
    return (number > 0 ? zero_skill_bonus + number - skill_min : 0);
}

/**
 * Converts point values to skill values.
 * Due to the zero skill bonus, the number of points spent is not the same as the skill value.
 * Spending 35 points gives a score of 55 if using the vanilla values.
 * This is calculated by the points spent plus the difference between the minimum skill threshold and the zero skill bonus
 * except if the points spent is 0, in which case the skill remains at 0.
 * e.g. with a 20 point bonus and a minimum of 35, 40 points spent gives a score of 40+35-20=55.
 * @param {*} number 
 * @param {*} zero_skill_bonus
 * @param {*} skill_min 
 * @returns The number converted to a skill value.
 */
function convert_from_points(number, skill_min, zero_skill_bonus) {
    return (number > 0 ? number + skill_min - zero_skill_bonus : 0);
}

/**
 * Called upon clicking the generate button, calls the generator functions and then returns the result.
 * @param {Map<string, number>} min_skills A map of skill names to numbers representing skill minimums
 * @returns The generated traits and skills.
 */
function generate(min_skills, skill_min, skill_max, zero_skill_bonus, bonus_points) {
    // Input values are in skill scores so convert them to points first.
    min_skills = _.map(min_skills, x => convert_to_points(x, skill_min, zero_skill_bonus));
    var min_points = convert_to_points(skill_min, skill_min, zero_skill_bonus);
    var max_points = convert_to_points(skill_max, skill_min, zero_skill_bonus);
    // Generate traits and update attribute minimums.
    var traits = roll_traits();
    set_trait_attr_mins(traits, min_skills);
    // Calculate how many points are available.
    var point_pool = calculate_point_pool(skill_min, skill_max, zero_skill_bonus, bonus_points);
    var points = point_pool - _.reduce(min_skills, (memo, num) => memo + num, 0);
    // Generate the skill points array.
    var skills = distribute_skills(min_skills, points, min_points, max_points);
    // Convert from points to skill values before returning.
    skills = _.map(skills, x => convert_from_points(x, skill_min, zero_skill_bonus));
    return [traits, skills];
}

export default generate;