import {
  SpaceshipRegistry,
  instance as spaceshipRegistryInstance,
} from '@civ-clone/core-spaceship/SpaceshipRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import Spaceship from '@civ-clone/core-spaceship/Spaceship';
import Start from '@civ-clone/core-turn-based-game/Rules/Start';

export const getRules = (
  spaceshipRegistry: SpaceshipRegistry = spaceshipRegistryInstance
): Start[] => [
  new Start(
    new Effect(() => {
      spaceshipRegistry
        .entries()
        .forEach((spaceship: Spaceship) => spaceship.check());
    })
  ),
];

export default getRules;
