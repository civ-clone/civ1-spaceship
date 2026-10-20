import {
  LayoutRegistry,
  instance as layoutRegistryInstance,
} from '@civ-clone/core-spaceship/LayoutRegistry';
import {
  PlayerRegistry,
  instance as playerRegistryInstance,
} from '@civ-clone/core-player/PlayerRegistry';
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
import ApolloProgram from '@civ-clone/base-wonder-apolloprogram/ApolloProgram';
import { BuildableInstance } from '@civ-clone/core-city-build/Buildable';
import BuildingComplete from '@civ-clone/core-city-build/Rules/BulidingComplete';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import Criterion from '@civ-clone/core-rule/Criterion';
import Default from '@civ-clone/civ1-default-spaceship-layout/Default';
import Effect from '@civ-clone/core-rule/Effect';
import Part from '@civ-clone/core-spaceship/Part';
import Player from '@civ-clone/core-player/Player';
import Spaceship from '@civ-clone/core-spaceship/Spaceship';

export const getRules = (
  playerRegistry: PlayerRegistry = playerRegistryInstance,
  spaceshipRegistry: SpaceshipRegistry = spaceshipRegistryInstance,
  layoutRegistry: LayoutRegistry = layoutRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  turn: Turn = turnInstance,
  year: Year = yearInstance
): BuildingComplete[] => [
  new BuildingComplete(
    new Criterion(
      (cityBuild: CityBuild, buildItem: BuildableInstance): buildItem is Part =>
        buildItem instanceof ApolloProgram
    ),
    // The Apollo Program lets every civilization build a spaceship, each on a layout of its own.
    new Effect(() => {
      // TODO: if there is more than one layout, ask the player to choose.
      const [LayoutType] = layoutRegistry.entries() as (typeof Default)[];

      playerRegistry
        .entries()
        .forEach((player: Player) =>
          spaceshipRegistry.register(
            new Spaceship(
              player,
              new LayoutType(ruleRegistry),
              ruleRegistry,
              turn,
              year
            )
          )
        );
    })
  ),
  new BuildingComplete(
    new Criterion(
      (cityBuild: CityBuild, buildItem: BuildableInstance): buildItem is Part =>
        buildItem instanceof Part
    ),
    new Criterion(
      (cityBuild: CityBuild, buildItem: BuildableInstance) =>
        spaceshipRegistry.getActiveByPlayer(
          (buildItem as Part).city().player()
        ) !== null
    ),
    new Effect((cityBuild: CityBuild, buildItem: BuildableInstance) => {
      const part = buildItem as Part;

      spaceshipRegistry.getActiveByPlayer(part.city().player())!.add(part);
    })
  ),
];

export default getRules;
