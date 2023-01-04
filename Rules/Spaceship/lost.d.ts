import { Engine } from '@civ-clone/core-engine/Engine';
import { LayoutRegistry } from '@civ-clone/core-spaceship/LayoutRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { SpaceshipRegistry } from '@civ-clone/core-spaceship/SpaceshipRegistry';
import { Turn } from '@civ-clone/core-turn-based-game/Turn';
import Lost from '@civ-clone/core-spaceship/Rules/Lost';
export declare const getRules: (
  spaceshipRegistry?: SpaceshipRegistry,
  layoutRegistry?: LayoutRegistry,
  ruleRegistry?: RuleRegistry,
  turn?: Turn,
  engine?: Engine,
  randomNumberGenerator?: () => number
) => Lost[];
export default getRules;
