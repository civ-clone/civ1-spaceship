import {
  Turn,
  instance as turnInstance,
} from '@civ-clone/core-turn-based-game/Turn';
import { Year, instance as yearInstance } from '@civ-clone/core-game-year/Year';
import FlightTime from '@civ-clone/core-spaceship/Rules/FlightTime';
import Effect from '@civ-clone/core-rule/Effect';
import { Mass } from '../../Yields';
import { Propulsion } from '../../Parts';
import Spaceship from '@civ-clone/core-spaceship/Spaceship';
import { reduceYield } from '@civ-clone/core-yield/lib/reduceYields';

export const getRules = (
  year: Year = yearInstance,
  turn: Turn = turnInstance
): FlightTime[] => [
  new FlightTime(
    new Effect((spaceship: Spaceship) => {
      const mass = reduceYield(spaceship.yields(), Mass),
        propulsion = spaceship
          .activeParts()
          .reduce(
            (total, part) => total + (part instanceof Propulsion ? 1 : 0),
            0
          ),
        years = Math.trunc((mass / 20 / (1 + propulsion * 10)) * 10) / 10,
        currentYear = year.value(),
        targetYear = currentYear + years;

      let targetTurn = turn.value();

      // convert to whole `Turn`s
      while (year.value(targetTurn) < targetYear) {
        targetTurn++;
      }

      return targetTurn;
    })
  ),
];

export default getRules;
