import { Build } from '@civ-clone/core-city-build/Rules/Build';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { Requirement } from '@civ-clone/core-requirement/Requirement';
import { SpaceshipRegistry } from '@civ-clone/core-spaceship/SpaceshipRegistry';
import { WonderRegistry } from '@civ-clone/core-wonder/WonderRegistry';
import { Deriver } from '@civ-clone/core-requirement/RequirementRegistry';
/** Parts are only built for a spaceship that hasn't launched: a state of the game, so a rule written by hand. */
export declare const notLaunchedRule: (
  spaceshipRegistry?: SpaceshipRegistry
) => Build;
/**
 * The rule `entry` is played by: a city may build its subject only while its targets are met. A Wonder is met once
 * anyone in the world has built it, and an advance once the city's player has discovered it. An entry about `Part`
 * itself, which is never built, is about every part.
 */
export declare const buildRulesFor: (
  entry: Requirement,
  wonderRegistry?: WonderRegistry,
  playerResearchRegistry?: PlayerResearchRegistry
) => Build[];
/** What `registerRules` gives the game's `requirements` to make each entry's rules with. */
export declare const deriveBuildRules: (
  wonderRegistry: WonderRegistry,
  playerResearchRegistry: PlayerResearchRegistry
) => Deriver;
/**
 * Every rule about which parts a city may build, as `registerRules` registers them: the Apollo Program's, the
 * unlaunched spaceship's, then one for each part's advance. For a rule registry without a game's `requirements`
 * (tests, and rulesets that build on these): a game's are registered through `game.requirements`, so a plugin can
 * change an entry and its rule together.
 */
export declare const getRules: (
  wonderRegistry?: WonderRegistry,
  playerResearchRegistry?: PlayerResearchRegistry,
  spaceshipRegistry?: SpaceshipRegistry
) => Build[];
export default getRules;
