import {
  Fuel,
  Habitation,
  LifeSupport,
  Power,
  Propulsion,
  Structural,
} from '../Parts';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Layout from '@civ-clone/core-spaceship/Layout';
import Slot from '@civ-clone/core-spaceship/Slot';

export const getLayouts = (
  ruleRegistry: RuleRegistry = ruleRegistryInstance
): Layout[] => [
  // . null
  // # Power
  // S Structural
  // F Fuel
  // ~ Propulsion
  // L LifeSupport
  // H Habitation

  // .........F~~
  // .##..##.SSS
  // .##..##.SF~~
  // SSSSSSSSSF~~
  // LLHHLLHHSSS
  // LLHHLLHHSF~~
  // HHLLHHLLSF~~
  // HHLLHHLLSSS
  // SSSSSSSSSF~~
  // .##..##.SF~~
  // .##..##.SSS
  // .........F~~
  new Layout(
    12,
    12,
    [
      // .........F~~
      new Slot(9, 0, 1, 1, [Fuel]),
      new Slot(10, 0, 1, 2, [Propulsion]),

      // .##..##.SSS
      new Slot(1, 1, 2, 2, [Power]),
      new Slot(5, 1, 2, 2, [Power]),
      new Slot(8, 1, 1, 1, [Structural]),
      new Slot(9, 1, 1, 1, [Structural]),
      new Slot(10, 1, 1, 1, [Structural]),

      // .##..##.SF~~
      new Slot(8, 2, 1, 1, [Structural]),
      new Slot(9, 2, 1, 1, [Fuel]),
      new Slot(10, 2, 1, 2, [Propulsion]),

      // SSSSSSSSSF~~
      new Slot(0, 3, 1, 1, [Structural]),
      new Slot(1, 3, 1, 1, [Structural]),
      new Slot(2, 3, 1, 1, [Structural]),
      new Slot(3, 3, 1, 1, [Structural]),
      new Slot(4, 3, 1, 1, [Structural]),
      new Slot(5, 3, 1, 1, [Structural]),
      new Slot(6, 3, 1, 1, [Structural]),
      new Slot(7, 3, 1, 1, [Structural]),
      new Slot(8, 3, 1, 1, [Structural]),
      new Slot(9, 3, 1, 1, [Fuel]),
      new Slot(10, 3, 1, 2, [Propulsion]),

      // LLHHLLHHSSS
      new Slot(0, 4, 2, 2, [LifeSupport]),
      new Slot(2, 4, 2, 2, [Habitation]),
      new Slot(4, 4, 2, 2, [LifeSupport]),
      new Slot(6, 4, 2, 2, [Habitation]),
      new Slot(8, 4, 1, 1, [Structural]),
      new Slot(9, 4, 1, 1, [Structural]),
      new Slot(10, 4, 1, 1, [Structural]),

      // LLHHLLHHSF~~
      new Slot(8, 5, 1, 1, [Structural]),
      new Slot(9, 5, 1, 1, [Fuel]),
      new Slot(10, 5, 1, 2, [Propulsion]),

      // HHLLHHLLSF~~
      new Slot(0, 6, 2, 2, [Habitation]),
      new Slot(2, 6, 2, 2, [LifeSupport]),
      new Slot(4, 6, 2, 2, [Habitation]),
      new Slot(6, 6, 2, 2, [LifeSupport]),
      new Slot(8, 6, 1, 1, [Structural]),
      new Slot(9, 6, 1, 1, [Fuel]),
      new Slot(10, 6, 1, 2, [Propulsion]),

      // HHLLHHLLSSS
      new Slot(8, 7, 1, 1, [Structural]),
      new Slot(9, 7, 1, 1, [Structural]),
      new Slot(10, 7, 1, 1, [Structural]),

      // SSSSSSSSSF~~
      new Slot(0, 8, 1, 1, [Structural]),
      new Slot(1, 8, 1, 1, [Structural]),
      new Slot(2, 8, 1, 1, [Structural]),
      new Slot(3, 8, 1, 1, [Structural]),
      new Slot(4, 8, 1, 1, [Structural]),
      new Slot(5, 8, 1, 1, [Structural]),
      new Slot(6, 8, 1, 1, [Structural]),
      new Slot(7, 8, 1, 1, [Structural]),
      new Slot(8, 8, 1, 1, [Structural]),
      new Slot(9, 8, 1, 1, [Fuel]),
      new Slot(10, 8, 1, 2, [Propulsion]),

      // .##..##.SF~~
      new Slot(1, 9, 2, 2, [Power]),
      new Slot(5, 9, 2, 2, [Power]),
      new Slot(8, 9, 1, 1, [Structural]),
      new Slot(9, 9, 1, 1, [Fuel]),
      new Slot(10, 9, 1, 2, [Propulsion]),

      // .##..##.SSS
      new Slot(8, 10, 1, 1, [Structural]),
      new Slot(9, 10, 1, 1, [Structural]),
      new Slot(10, 10, 1, 1, [Structural]),

      // .........F~~
      new Slot(9, 11, 1, 1, [Fuel]),
      new Slot(10, 11, 1, 2, [Propulsion]),
    ],
    ruleRegistry
  ),
];

export default getLayouts;
