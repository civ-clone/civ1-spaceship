import { CurrentPlayerRegistry } from '@civ-clone/core-player/CurrentPlayerRegistry';
import { LayoutRegistry } from '@civ-clone/core-spaceship/LayoutRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { SpaceshipRegistry } from '@civ-clone/core-spaceship/SpaceshipRegistry';
import { Turn } from '@civ-clone/core-turn-based-game/Turn';
import { Year } from '@civ-clone/core-game-year/Year';
import BuildingComplete from '@civ-clone/core-city-build/Rules/BulidingComplete';
export declare const getRules: (
  currentPlayerRegistry?: CurrentPlayerRegistry,
  spaceshipRegistry?: SpaceshipRegistry,
  layoutRegistry?: LayoutRegistry,
  ruleRegistry?: RuleRegistry,
  turn?: Turn,
  year?: Year,
  randomNumberGenerator?: () => number
) => BuildingComplete[];
export default getRules;
