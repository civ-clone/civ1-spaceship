import Effect from '@civ-clone/core-rule/Effect';
import FlightTime from '@civ-clone/core-spaceship/Rules/FlightTime';
import { Mass } from '../../Yields';
import { Propulsion } from '../../Parts';
import Spaceship from '@civ-clone/core-spaceship/Spaceship';
import { reduceYield } from '@civ-clone/core-yield/lib/reduceYields';

export const getRules = (): FlightTime[] => [
  new FlightTime(
    new Effect((spaceship: Spaceship) => {
      const mass = reduceYield(spaceship.yields(), Mass),
        propulsion = spaceship
          .activeParts()
          .reduce(
            (total, part) => total + (part instanceof Propulsion ? 1 : 0),
            0
          );

      return Math.trunc((mass / 20 / (1 + propulsion * 10)) * 10) / 10;
    })
  ),
];

export default getRules;
