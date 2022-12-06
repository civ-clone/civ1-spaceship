import {
  BuildCost,
  buildCost,
} from '@civ-clone/core-city-build/Rules/BuildCost';
import {
  Fuel,
  Habitation,
  LifeSupport,
  Power,
  Propulsion,
  Structural,
} from '../../Parts';
import Part from '@civ-clone/core-spaceship/Part';

export const getRules = (): BuildCost[] => [
  ...(
    [
      [Fuel, 160],
      [Habitation, 320],
      [LifeSupport, 320],
      [Power, 320],
      [Propulsion, 160],
      [Structural, 80],
    ] as [typeof Part, number][]
  ).flatMap(([PartType, cost]: [typeof Part, number]): BuildCost[] =>
    buildCost(PartType, cost)
  ),
];

export default getRules;
