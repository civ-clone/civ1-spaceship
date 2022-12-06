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
import Spaceship from '@civ-clone/core-spaceship/Spaceship';
import Validate from '@civ-clone/core-spaceship/Rules/Validate';

export const getRules = (): Validate[] => [
  ...(
    [
      [Structural, 34],
      [Fuel, 8],
      [Propulsion, 8],
      [Habitation, 4],
      [LifeSupport, 4],
      [Power, 4],
    ] as [typeof Part, number][]
  ).map(
    ([PartType, maximumNumber]) =>
      new Validate(
        new Criterion((part: Part) => part instanceof PartType),
        new Effect(
          (part: Part, spaceship: Spaceship) =>
            spaceship.parts().filter((part) => part instanceof PartType)
              .length < maximumNumber
        )
      )
  ),
];

export default getRules;
