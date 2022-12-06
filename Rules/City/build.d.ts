import { Build } from '@civ-clone/core-city-build/Rules/Build';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { SpaceshipRegistry } from '@civ-clone/core-spaceship/SpaceshipRegistry';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
export declare const getRules: (
  wonderRegistry?: WonderRegistry,
  playerResearchRegistry?: PlayerResearchRegistry,
  spaceshipRegistry?: SpaceshipRegistry
) => Build[];
export default getRules;
