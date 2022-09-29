import random

# settings
is_male = False
reroll_dupes = True
avoid_traits = ["","psycho", "coward"]
allow_dupes = []
reroll_none = True
MAX_REROLLS = 5
# Min attribute thresholds
min_hp = 65
min_dex = 55
min_agi = 55
min_str = 35
min_wis = 65
min_ldr = 35
# Min skill thresholds
min_mrk = 65
min_exp = 0
min_med = 35
min_mec = 0
# Max point pool increased by 90 to account for the attr min of 35
max_point_pool = 390

# Trait pool
trait_pool = ["ambidextrous", "auto weapons", "camouflaged", "electronics",
              "hand-to-hand", "heavy weapons", "knifing", "lockpicking",
              "martial arts", "night ops", "on roof", "stealth",
              "teaching", "throwing"]

# Questions for vanilla IMP personality test
q1 = ["martial arts" if is_male else "ambidexterous",
      "loner",
      "hand-to-hand",
      "lockpicking",
      "throwing",
      "optimist"]
q2 = ["teaching",
      "stealthy",
      "psycho",
      "friendly"]
q3 = ["lockpicking",
      "arrogant",
      "stealthy",
      "normal"]
q4 = ["auto weapons",
      "friendly",
      "normal",
      "asshole",
      "loner"]
q5 = ["coward",
      "",
      "aggressive",
      ""]
q6 = ["coward",
      "night ops",
      "claustrophobic",
      "",
      ""]
q7 = ["electronics",
      "knifing",
      "night ops",
      ""]
q8 = ["ambidexterous",
      "",
      "optimist",
      "psycho"]
q9 = ["forgetful",
      "",
      "pessimist",
      "nervous"]
q10 = ["",
       "pessimist",
       "asshole",
       "nervous"]
q11 = ["",
       "teaching",
       "aggressive",
       "normal",
       ""]
q12 = ["martial arts" if is_male else "ambidexterous",
       "knifing",
       "",
       "auto weapons",
       "hand-to-hand",
       "electronics",
       "",
       ""]
q13 = ["forgetful",
       "normal",
       "normal",
       "heat-intolerant"]
q14 = ["claustrophobic",
       "normal",
       "heat-intolerant",
       ""]
q15 = ["throwing",
       "ambidexterous",
       "arrogant",
       ""]

questions = [q1, q2, q3, q4, q5, q6, q7, q8,
             q9, q10, q11, q12, q13, q14, q15]
answers = []
traits = []

# roll a random answer for the personality test
# TODO: We need to randomly select two traits to select, as well as one personality type
# TODO: To do this we'll probably need to figure out possible combinations or something
# def roll(q, rerolls):
#     num = random.randrange(len(q))
#     if rerolls > 0:
#         if q[num] in avoid_traits: # reroll trait that we're avoiding
#             print(f"Avoiding {q[num]}")
#             return roll(q, rerolls-1)
#         if reroll_dupes and q[num] not in allow_dupes and q[num] in traits: # reroll answers that give a duplicate skill
#             print(f"Already have {q[num]}")
#             return roll(q, rerolls-1)
#     return num
# TODO: Then we need to go through the questions and select the matching answers (random roll for conflicts)
# TODO: Traits will need to be removed from potential choices based on the generated attributes
#       Electronics     MEC > 0
#       Lockpicking     ( ( ( ( MEC * WIS ) / 100 ) * DEX ) / 100 ) + 25 >= 50 (193 total in MEC+WIS+DEX)
#       Auto Weapons    MRK > 0
#       Heavy Weapons   MRK > 0
#       (Actually these don't seem to be checked but it might be good to implement anyway)
# TODO: This may mean generating attributes before traits
# TODO: Two traits of the same choice become an expert trait (except electronics and ambidextrous)
#       Is this even true?

# TODO: This is for when personality test generation is done
# for q in questions:
#     num = roll(q, MAX_REROLLS)
#     answers.append(num+1)
#     traits.append(q[num])

# Chooses two random traits from those available
# TODO: Allow rolling 1 trait which will results in an expert trait except for electronics, ambidextrous, and camouflaged
def roll_traits():
      traits = random.sample(trait_pool, 2)
      return traits

# Increase attribute minimums if certain traits are picked
# TODO: Probably should make this account for other skills
def trait_attr_mins(traits, min_mec, min_mrk):
      if "electronics" or "lockpicking" in traits:
            min_mec = max(min_mec, 35)
      if "lockpicking" in traits:
            min_mec = max(min_mec, 35)
      if "auto weapons" or "heavy weapons" in traits:
            min_mrk = max(min_mrk, 35)
      return min_mec, min_mrk

def constrained_sum_sample_pos(n, total):
    """Return a randomly chosen list of n positive integers summing to total.
    Each such list is equally likely to occur."""
    
    dividers = sorted(random.sample(range(1, total), n - 1))
    return [a - b for a, b in zip(dividers + [total], [0] + dividers)]

def constrained_sum_sample_nonneg(n, total):
    """Return a randomly chosen list of n nonnegative integers summing to total.
    Each such list is equally likely to occur."""

    return [x - 1 for x in constrained_sum_sample_pos(n, total + n)]

def distribute_skills(skills,points):
    while points or any(x > 65 for x in skills):
        print(f"current points: {points}")
        sample = constrained_sum_sample_nonneg(10, points)
        print(f"sample: {sample}")
        skills = [x+y for x, y in zip(skills, sample)]
        print(f"sum: {skills}")
        # the first 35 points only cost 15
        # for i, n in enumerate(skills):
        #     if 15 <= n < 35:
        #         skills[i] = 35+(n-15)
        print(f"sum after: {skills}")
        points = reclaim_points(skills)
    return skills, points

def reclaim_points(sum_skills):
    points_remaining = 0
    for i, n in enumerate(sum_skills):
        print(f"total points: {sum(sum_skills)}")
        # if the number isn't within valid skill range then reclaim points
        if not 15 <= n <= 65:
            print(f"current n: {n}")
            m = 0 if n < 15 else 65 # skills below 35 become 0 and are capped at 85
            print(f"current m: {m}")
            sum_skills[i] = m # set the capped value
            print(f"difference: {n-m}")
            #d = (15 if m==0 else n) - m # dropping to 0 points only gives 15 points, not 35
            print(f"real points difference: {n-m}")
            points_remaining += n-m
            print(f"points remaining: {points_remaining}")
            print(sum_skills)
    return points_remaining

traits = roll_traits()
min_mec, min_mrk = trait_attr_mins(traits, min_mec, min_mrk)
min_skills = [min_hp, min_dex, min_agi, min_str, min_wis, min_ldr, min_mrk, min_exp, min_med, min_mec]

skills = []
print(f"min skills so far: {min_skills}")
min_skills = [max(x-20, 0) for x in min_skills] # This modifies the skill values to compensate for the 0 points bonus
# print(f"min skill point values: {min_skills_points}")
print(f"min skills: {min_skills}")
points = max_point_pool - sum(min_skills)
print(f"point pool: {points}")
skills, points = distribute_skills(min_skills, points)
skills = [x+20 if x > 15 else 0 for x in skills]
print(f"final skills: {skills}")
print(f"remaining points: {points}")
print(f"sum of skills: {sum(skills)}")

print("\u2500"*20)
for t in traits: print(t)
# results = zip(answers, traits)
# for answer, trait in results:
#     print(f"#{answer}\t{trait}")
print("\u2500"*20)
skill_names = ["HP", "DEX", "AGI", "STR", "WIS", "LDR", "MRK", "EXP", "MED", "MEC"]
for skill, val in zip(skill_names, skills):
    print(f"{skill}\t{val}")