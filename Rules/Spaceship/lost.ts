import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  SpaceshipRegistry,
  instance as spaceshipRegistryInstance,
} from '@civ-clone/core-spaceship/SpaceshipRegistry';
import {
  Turn,
  instance as turnInstance,
} from '@civ-clone/core-turn-based-game/Turn';
import Effect from '@civ-clone/core-rule/Effect';
import Lost from '@civ-clone/core-spaceship/Rules/Lost';
import Spaceship from '@civ-clone/core-spaceship/Spaceship';
import {
  instance as layoutRegistryInstance,
  LayoutRegistry,
} from '@civ-clone/core-spaceship/LayoutRegistry';

export const getRules = (
  spaceshipRegistry: SpaceshipRegistry = spaceshipRegistryInstance,
  layoutRegistry: LayoutRegistry = layoutRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  turn: Turn = turnInstance,
  randomNumberGenerator: () => number = () => Math.random()
): Lost[] => [
  new Lost(
    new Effect((spaceship: Spaceship) => {
      // TODO: if there is more than one layout, ask the player to choose.
      const [layout] = layoutRegistry.entries();

      spaceshipRegistry.register(
        new Spaceship(
          spaceship.player(),
          layout,
          ruleRegistry,
          turn,
          randomNumberGenerator
        )
      );
    })
  ),
];

export default getRules;
