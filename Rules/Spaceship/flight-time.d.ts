import { Turn } from '@civ-clone/core-turn-based-game/Turn';
import { Year } from '@civ-clone/core-game-year/Year';
import FlightTime from '@civ-clone/core-spaceship/Rules/FlightTime';
export declare const getRules: (year?: Year, turn?: Turn) => FlightTime[];
export default getRules;
