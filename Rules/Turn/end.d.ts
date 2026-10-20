import { PlayerRegistry } from '@civ-clone/core-player/PlayerRegistry';
import { SpaceshipRegistry } from '@civ-clone/core-spaceship/SpaceshipRegistry';
import End from '@civ-clone/core-turn-based-game/Rules/End';
export declare const getRules: (
  spaceshipRegistry?: SpaceshipRegistry,
  playerRegistry?: PlayerRegistry
) => End[];
export default getRules;
