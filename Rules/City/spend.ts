import CityBuild from '@civ-clone/core-city-build/CityBuild';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Gold from '@civ-clone/base-city-yield-gold/Gold';
import Part from '@civ-clone/core-spaceship/Part';
import Spend from '@civ-clone/core-treasury/Rules/Spend';
import SpendCost from '@civ-clone/core-treasury/SpendCost';

export const getRules: () => Spend[] = (): Spend[] => [
  new Spend(
    new Criterion(
      (cityBuild: CityBuild): boolean =>
        cityBuild.building() !== null &&
        Object.isPrototypeOf.call(Part, cityBuild.building()!.item())
    ),
    new Criterion(
      (cityBuild: CityBuild): boolean => cityBuild.progress().value() === 0
    ),
    new Effect(
      (cityBuild: CityBuild): SpendCost =>
        new SpendCost(Gold, cityBuild.remaining() * 8)
    )
  ),

  new Spend(
    new Criterion(
      (cityBuild: CityBuild): boolean =>
        cityBuild.building() !== null &&
        Object.isPrototypeOf.call(Part, cityBuild.building()!.item())
    ),
    new Criterion(
      (cityBuild: CityBuild): boolean => cityBuild.progress().value() > 0
    ),
    new Effect(
      (cityBuild: CityBuild): SpendCost =>
        new SpendCost(Gold, cityBuild.remaining() * 4)
    )
  ),
];

export default getRules;
