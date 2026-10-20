import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import {
  LayoutRegistry,
  instance as layoutRegistryInstance,
} from '@civ-clone/core-spaceship/LayoutRegistry';
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
import { Year, instance as yearInstance } from '@civ-clone/core-game-year/Year';
import Default from '@civ-clone/civ1-default-spaceship-layout/Default';
import Effect from '@civ-clone/core-rule/Effect';
import Lost from '@civ-clone/core-spaceship/Rules/Lost';
import Spaceship from '@civ-clone/core-spaceship/Spaceship';

export const getRules = (
  spaceshipRegistry: SpaceshipRegistry = spaceshipRegistryInstance,
  layoutRegistry: LayoutRegistry = layoutRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  turn: Turn = turnInstance,
  year: Year = yearInstance,
  engine: Engine = engineInstance
): Lost[] => [
  new Lost(
    new Effect((spaceship: Spaceship) => {
      // Whether it had launched: one in flight returns to Earth, one being built is cancelled.
      engine.emit(
        'player:spaceship:lost',
        spaceship.player(),
        spaceship.launched() !== false
      );
    })
  ),

  new Lost(
    new Effect((spaceship: Spaceship) => {
      // TODO: if there is more than one layout, ask the player to choose.
      const [LayoutType] = layoutRegistry.entries() as (typeof Default)[],
        layout = new LayoutType(ruleRegistry);

      spaceshipRegistry.register(
        new Spaceship(spaceship.player(), layout, ruleRegistry, turn, year)
      );
    })
  ),
];

export default getRules;
