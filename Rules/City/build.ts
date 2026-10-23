import { Build, IBuildCriterion } from '@civ-clone/core-city-build/Rules/Build';
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
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import { Deriver } from '@civ-clone/core-requirement/RequirementRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import { IConstructor } from '@civ-clone/core-registry/Registry';
import Part from '@civ-clone/core-spaceship/Part';
import Wonder from '@civ-clone/core-wonder/Wonder';
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
 */
export const buildRulesFor = (
  entry: Requirement,
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance
): Build[] => {
  if (entry.relation !== 'requires') {
    return [];
  }

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
            met(entry, (target: Target): boolean =>
              Object.prototype.isPrototypeOf.call(Wonder, target)
                ? wonderRegistry.some(
                    (wonder: Wonder): boolean =>
                      wonder instanceof (target as typeof Wonder)
                  )
                : playerResearchRegistry
                    .getByPlayer(city.player())
                    .completed(target as typeof Advance)
            )
          )
      )
    ),
  ];
};

/** What `registerRules` gives the game's `requirements` to make each entry's rules with. */
export const deriveBuildRules =
  (
    wonderRegistry: WonderRegistry,
    playerResearchRegistry: PlayerResearchRegistry
  ): Deriver =>
  (entry: Requirement): Build[] =>
    buildRulesFor(entry, wonderRegistry, playerResearchRegistry);

/**
 * Every rule about which parts a city may build, as `registerRules` registers them: the Apollo Program's, the
 * unlaunched spaceship's, then one for each part's advance. For a rule registry without a game's `requirements`
 * (tests, and rulesets that build on these): a game's are registered through `game.requirements`, so a plugin can
 * change an entry and its rule together.
 */
export const getRules = (
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  spaceshipRegistry: SpaceshipRegistry = spaceshipRegistryInstance
): Build[] => [
  ...requiresWonder.flatMap((entry: Requirement): Build[] =>
    buildRulesFor(entry, wonderRegistry, playerResearchRegistry)
  ),
  notLaunchedRule(spaceshipRegistry),
  ...requiresAdvance.flatMap((entry: Requirement): Build[] =>
    buildRulesFor(entry, wonderRegistry, playerResearchRegistry)
  ),
];

export default getRules;
