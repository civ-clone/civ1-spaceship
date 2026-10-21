import { CityBuildRegistry } from '@civ-clone/core-city-build/CityBuildRegistry';
import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { PlayerRegistry } from '@civ-clone/core-player/PlayerRegistry';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
import { LayoutRegistry } from '@civ-clone/core-spaceship/LayoutRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { SpaceshipRegistry } from '@civ-clone/core-spaceship/SpaceshipRegistry';
import { Turn } from '@civ-clone/core-turn-based-game/Turn';
import { Year } from '@civ-clone/core-game-year/Year';
import Start from '@civ-clone/core-turn-based-game/Rules/Start';
export declare const getRules: (
  spaceshipRegistry?: SpaceshipRegistry,
  layoutRegistry?: LayoutRegistry,
  ruleRegistry?: RuleRegistry,
  turn?: Turn,
  year?: Year,
  cityRegistry?: CityRegistry,
  cityBuildRegistry?: CityBuildRegistry,
  playerRegistry?: PlayerRegistry,
  wonderRegistry?: WonderRegistry
) => Start[];
export default getRules;
