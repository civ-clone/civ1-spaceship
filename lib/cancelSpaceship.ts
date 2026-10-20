import Player from '@civ-clone/core-player/Player';
import { SpaceshipRegistry } from '@civ-clone/core-spaceship/SpaceshipRegistry';

// The player's spaceship goes back to Earth if it has launched, or its construction is cancelled if it hasn't. A ship
//  with no parts yet has nothing to lose.
export const cancelSpaceship = (
  player: Player,
  spaceshipRegistry: SpaceshipRegistry
): void => {
  const spaceship = spaceshipRegistry.getActiveByPlayer(player);

  if (
    spaceship === null ||
    (spaceship.launched() === false &&
      spaceship.activeParts().length + spaceship.inactiveParts().length === 0)
  ) {
    return;
  }

  spaceship.lose();
};

export default cancelSpaceship;
