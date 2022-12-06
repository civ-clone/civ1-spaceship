import {
  Energy,
  LifeSupport as LifeSupportYield,
  Mass,
  Population,
} from '../../Yields';
import {
  Fuel,
  Habitation,
  LifeSupport,
  Power,
  Propulsion,
  Structural,
} from '../../Parts';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Part from '@civ-clone/core-spaceship/Part';
import Yield from '@civ-clone/core-spaceship/Rules/Yield';
import YieldValue from '@civ-clone/core-yield/Yield';

export const getRules = (): Yield[] => [
  ...(
    [
      [Fuel, Mass, 400],

      [Habitation, Energy, -50],
      [Habitation, LifeSupportYield, -100],
      [Habitation, Mass, 1600],
      [Habitation, Population, 10000],

      [LifeSupport, Energy, -50],
      [LifeSupport, LifeSupportYield, 100],
      [LifeSupport, Mass, 1600],

      [Power, Energy, 100],
      [Power, Mass, 400],

      [Propulsion, Mass, 400],

      // All SS Structural = 3900
      // This is weird, in the original game, the values are 200 for five of the pieces, but 100 for the others, so this
      //  should be 114.705882352941176... I'll keep at 100 for now!
      [Structural, Mass, 100],
    ] as [typeof Part, typeof YieldValue, number][]
  ).map(
    ([PartType, YieldType, value]) =>
      new Yield(
        new Criterion((part: Part) => part instanceof PartType),
        new Effect((part: Part) => new YieldType(value, part.id()))
      )
  ),
];

export default getRules;
