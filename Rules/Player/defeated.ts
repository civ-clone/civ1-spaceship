import {
  SpaceshipRegistry,
  instance as spaceshipRegistryInstance,
} from '@civ-clone/core-spaceship/SpaceshipRegistry';
import Defeated from '@civ-clone/core-player/Rules/Defeated';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import cancelSpaceship from '../../lib/cancelSpaceship';

export const getRules = (
  spaceshipRegistry: SpaceshipRegistry = spaceshipRegistryInstance
): Defeated[] => [
  // A civilization destroyed loses its spaceship too, so a ship in flight can't land for a player who is gone.
  new Defeated(
    'civ1-spaceship:player/defeated/cancel-spaceship',
    new Effect((player: Player): void =>
      cancelSpaceship(player, spaceshipRegistry)
    )
  ),
];

export default getRules;
