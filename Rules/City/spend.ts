import CityBuild from '@civ-clone/core-city-build/CityBuild';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Part from '@civ-clone/core-spaceship/Part';
import Spend from '@civ-clone/core-treasury/Rules/Spend';
import Yield from '@civ-clone/core-yield/Yield';

export const getRules: () => Spend[] = (): Spend[] => [
  new Spend(
    new Criterion(
      (cityBuild: CityBuild): boolean =>
        typeof cityBuild.building() !== 'undefined' &&
        Object.isPrototypeOf.call(Part, cityBuild.building()!.item())
    ),
    new Criterion(
      (cityBuild: CityBuild): boolean => cityBuild.progress().value() === 0
    ),
    new Effect((cityBuild: CityBuild, cost: Yield): Yield => {
      cost.add(cityBuild.remaining() * 8);

      return cost;
    })
  ),

  new Spend(
    new Criterion(
      (cityBuild: CityBuild): boolean =>
        typeof cityBuild.building() !== 'undefined' &&
        Object.isPrototypeOf.call(Part, cityBuild.building()!.item())
    ),
    new Criterion(
      (cityBuild: CityBuild): boolean => cityBuild.progress().value() > 0
    ),
    new Effect((cityBuild: CityBuild, cost: Yield): Yield => {
      cost.add(cityBuild.remaining() * 4);

      return cost;
    })
  ),
];

export default getRules;
