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
import Player from '@civ-clone/core-player/Player';

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
      playerRegistry.entries().some((player: Player): boolean => {
        const spaceship = spaceshipRegistry.getActiveByPlayer(player);

        if (spaceship === null) {
          return false;
        }

        spaceship.check();

        return spaceship.successful() === true;
      });
    })
  ),
];

export default getRules;
