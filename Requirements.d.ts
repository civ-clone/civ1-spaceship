import {
  Condition,
  Requirement,
} from '@civ-clone/core-requirement/Requirement';
/** Every part needs the Apollo Program built, by anyone: one rule, about all of them. */
export declare const requiresWonder: Requirement[];
/** The advance a city's player needs before it can build each part: one rule each. */
export declare const requiresAdvance: Requirement[];
/** A player with a spaceship that hasn't launched, which `Rules/City/build`'s own rule decides. */
export declare const unlaunchedSpaceship: Condition;
/**
 * Parts are only built for a spaceship that hasn't launched. The rule is written by hand; this entry names it for the
 * civilopedia.
 */
export declare const notLaunched: Requirement;
/** The entries `Rules/City/build`'s deriver makes rules from, in the order the rules were always registered. */
export declare const buildRequirements: Requirement[];
/** The entries that only describe: no rule is made from them. */
export declare const describedRequirements: Requirement[];
export default buildRequirements;
