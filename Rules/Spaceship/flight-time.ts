import FlightTime from '@civ-clone/core-spaceship/Rules/FlightTime';
import Effect from '@civ-clone/core-rule/Effect';
import Spaceship from '@civ-clone/core-spaceship/Spaceship';
import { reduceYield } from '@civ-clone/core-yield/lib/reduceYields';
import { Mass } from '../../Yields';
import { Propulsion } from '../../Parts';

export const getRules = (): FlightTime[] => [
  new FlightTime(
    new Effect((spaceship: Spaceship) => {
      const mass = reduceYield(spaceship.yields(), Mass),
        propulsion = spaceship
          .parts()
          .reduce(
            (total, part) => total + (part instanceof Propulsion ? 1 : 0),
            0
          );

      return Math.trunc((mass / 20 / (1 + propulsion * 10)) * 10) / 10;
    })
  ),
];

export default getRules;
