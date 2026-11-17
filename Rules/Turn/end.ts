import {
  PlayerRegistry,
  instance as playerRegistryInstance,
} from '@civ-clone/core-player/PlayerRegistry';
import {
  SpaceshipRegistry,
  instance as spaceshipRegistryInstance,
} from '@civ-clone/core-spaceship/SpaceshipRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import End from '@civ-clone/core-turn-based-game/Rules/End';
import High from '@civ-clone/core-rule/Priorities/High';
import landFirstArrival from '@civ-clone/base-spaceship/lib/landFirstArrival';

export const getRules = (
  spaceshipRegistry: SpaceshipRegistry = spaceshipRegistryInstance,
  playerRegistry: PlayerRegistry = playerRegistryInstance
): End[] => [
  // Once every player has moved, the first ship whose arrival turn has come lands (v474.05 `GameEngine.cs` L364-375).
  //  In player order, so the first player's ship wins a tie, and one landing is the turn's arrival: any other ship due
  //  lands on a later turn. `High`, so a landing comes before any other ending checked at the end of the same turn,
  //  as v474.05 checks the spaceship first.
  new End(
    'civ1-spaceship:turn/end/arrival',
    new High(),
    new Effect((): void => {
      landFirstArrival(playerRegistry, spaceshipRegistry);
    })
  ),
];

export default getRules;
