import { Build, IBuildCriterion } from '@civ-clone/core-city-build/Rules/Build';
import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  Requirement,
  Target,
  met,
} from '@civ-clone/core-requirement/Requirement';
import {
  SpaceshipRegistry,
  instance as spaceshipRegistryInstance,
} from '@civ-clone/core-spaceship/SpaceshipRegistry';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import Advance from '@civ-clone/core-science/Advance';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import { Deriver } from '@civ-clone/core-requirement/RequirementRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import { IConstructor } from '@civ-clone/core-registry/Registry';
import Part from '@civ-clone/core-spaceship/Part';
import Wonder from '@civ-clone/core-wonder/Wonder';
import { everBuilt } from '@civ-clone/civ1-wonder/lib/wonderHistory';
import { requiresAdvance, requiresWonder } from '../../Requirements';

/** Parts are only built for a spaceship that hasn't launched: a state of the game, so a rule written by hand. */
export const notLaunchedRule = (
  spaceshipRegistry: SpaceshipRegistry = spaceshipRegistryInstance
): Build =>
  new Build(
    'civ1-spaceship:city/build/not-launched',
    Part,
    new Criterion((city: City, BuildItem: IConstructor): boolean =>
      Object.prototype.isPrototypeOf.call(Part, BuildItem)
    ),
    new Effect(
      (city: City) =>
        new Criterion(() => {
          const spaceship = spaceshipRegistry.getActiveByPlayer(city.player());

          if (spaceship === null) {
            return false;
          }

          return spaceship.launched() === false;
        })
    )
  );

/**
 * The rule `entry` is played by: a city may build its subject only while its targets are met. A Wonder is met once
 * anyone in the world has built it, and an advance once the city's player has discovered it. An entry about `Part`
 * itself, which is never built, is about every part.
 *
 * A Wonder in a `world` entry counts once it has ever been built, even if it has been lost with its city since
 * (civ-clone/web-renderer#971): v474.05 leaves parts out of the production menu only while the Apollo Program has never
 * been built, or once the civilization has launched (`ECONOMY.C` `find_slot` 220:
 * `if (i > 21 && (marvel_site[19] == -1 || (game_flags & (1 << civ)))) continue;`), and a Wonder lost with its city is
 * `0x80`, not `-1` (`ECONOMY.C` `vanish` 113-114). In a `city` or `player` entry it counts only while it stands there.
 */
export const buildRulesFor = (
  entry: Requirement,
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance
): Build[] => {
  if (entry.relation !== 'requires') {
    return [];
  }

  // Whose Wonder or advance counts is the entry's `range`: the Apollo Program is anyone's (`world`), an advance the
  //  city's player's (`player`).
  const has = (city: City, target: Target): boolean => {
    if (Object.prototype.isPrototypeOf.call(Wonder, target)) {
      const isTarget = (wonder: Wonder): boolean =>
        wonder instanceof (target as typeof Wonder);

      return entry.range === 'world'
        ? everBuilt(
            target as typeof Wonder,
            wonderRegistry,
            cityImprovementRegistry
          )
        : entry.range === 'city'
        ? wonderRegistry.getByCity(city).some(isTarget)
        : wonderRegistry.getByPlayer(city.player()).some(isTarget);
    }

    return entry.range === 'world'
      ? playerResearchRegistry.some((playerResearch: PlayerResearch): boolean =>
          playerResearch.completed(target as typeof Advance)
        )
      : playerResearchRegistry
          .getByPlayer(city.player())
          .completed(target as typeof Advance);
  };

  return [
    new Build(
      entry.id,
      entry.subject,
      new Criterion((city: City, BuildItem: IConstructor): boolean =>
        entry.subject === Part
          ? Object.prototype.isPrototypeOf.call(Part, BuildItem)
          : BuildItem === entry.subject
      ),
      new Effect(
        (city: City): IBuildCriterion =>
          new Criterion((): boolean =>
            met(entry, (target: Target): boolean => has(city, target))
          )
      )
    ),
  ];
};

/** What `registerRules` gives the game's `requirements` to make each entry's rules with. */
export const deriveBuildRules =
  (
    wonderRegistry: WonderRegistry,
    playerResearchRegistry: PlayerResearchRegistry,
    cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance
  ): Deriver =>
  (entry: Requirement): Build[] =>
    buildRulesFor(
      entry,
      wonderRegistry,
      playerResearchRegistry,
      cityImprovementRegistry
    );

/**
 * Every rule about which parts a city may build, as `registerRules` registers them: the Apollo Program's, the
 * unlaunched spaceship's, then one for each part's advance. For a rule registry without a game's `requirements`
 * (tests, and rulesets that build on these): a game's are registered through `game.requirements`, so a plugin can
 * change an entry and its rule together.
 */
export const getRules = (
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  spaceshipRegistry: SpaceshipRegistry = spaceshipRegistryInstance,
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance
): Build[] => [
  ...requiresWonder.flatMap((entry: Requirement): Build[] =>
    buildRulesFor(
      entry,
      wonderRegistry,
      playerResearchRegistry,
      cityImprovementRegistry
    )
  ),
  notLaunchedRule(spaceshipRegistry),
  ...requiresAdvance.flatMap((entry: Requirement): Build[] =>
    buildRulesFor(
      entry,
      wonderRegistry,
      playerResearchRegistry,
      cityImprovementRegistry
    )
  ),
];

export default getRules;
