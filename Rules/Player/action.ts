import {
  SpaceshipRegistry,
  instance as spaceshipRegistryInstance,
} from '@civ-clone/core-spaceship/SpaceshipRegistry';
import Action from '@civ-clone/core-player/Rules/Action';
import Player from '@civ-clone/core-player/Player';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import LaunchSpaceship from '@civ-clone/base-player-action-launch-spaceship/LaunchSpaceship';

export const getRules = (
  spaceshipRegistry: SpaceshipRegistry = spaceshipRegistryInstance
): Action[] => [
  new Action(
    new Criterion(
      (player: Player): boolean =>
        spaceshipRegistry.getActiveByPlayer(player) !== null
    ),
    new Effect((player: Player): LaunchSpaceship[] => [
      new LaunchSpaceship(player, spaceshipRegistry.getActiveByPlayer(player)!),
    ])
  ),
];

export default getRules;
