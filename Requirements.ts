import {
  Condition,
  Requirement,
  table,
} from '@civ-clone/core-requirement/Requirement';
import {
  Fuel,
  Habitation,
  LifeSupport,
  Power,
  Propulsion,
  Structural,
} from './Parts';
import ApolloProgram from '@civ-clone/base-wonder-apolloprogram/ApolloProgram';
import Part from '@civ-clone/core-spaceship/Part';
import Plastics from '@civ-clone/base-science-advance-plastics/Plastics';
import Robotics from '@civ-clone/base-science-advance-robotics/Robotics';
import SpaceFlight from '@civ-clone/base-science-advance-spaceflight/SpaceFlight';

// What Civilization's spaceship parts need, as the entries `Rules/City/build` makes its rules from
//  (civ-clone/web-renderer#37). `registerRules` adds them to the game's `requirements`.

/** Every part needs the Apollo Program built, by anyone: one rule, about all of them. */
export const requiresWonder: Requirement[] = table(
  'civ1-spaceship:city/build/requires-wonder',
  'requires',
  [[Part, ApolloProgram]],
  {
    range: 'world',
  }
);

/** The advance a city's player needs before it can build each part: one rule each. */
export const requiresAdvance: Requirement[] = table(
  'civ1-spaceship:city/build/requires-advance',
  'requires',
  [
    [Structural, SpaceFlight],
    [Fuel, Plastics],
    [Propulsion, Plastics],
    [Habitation, Robotics],
    [LifeSupport, Robotics],
    [Power, Robotics],
  ]
);

/** A player with a spaceship that hasn't launched, which `Rules/City/build`'s own rule decides. */
export const unlaunchedSpaceship = new Condition(
  'civ1-spaceship:unlaunched-spaceship'
);

/**
 * Parts are only built for a spaceship that hasn't launched. The rule is written by hand; this entry names it for the
 * civilopedia.
 */
export const notLaunched = new Requirement({
  id: 'civ1-spaceship:city/build/not-launched',
  subject: Part,
  relation: 'requires',
  targets: [unlaunchedSpaceship],
});

/** The entries `Rules/City/build`'s deriver makes rules from, in the order the rules were always registered. */
export const buildRequirements: Requirement[] = [
  ...requiresWonder,
  ...requiresAdvance,
];

/** The entries that only describe: no rule is made from them. */
export const describedRequirements: Requirement[] = [notLaunched];

export default buildRequirements;
