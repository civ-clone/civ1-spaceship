import {
  CurrentPlayerRegistry,
  instance as currentPlayerRegistryInstance,
} from '@civ-clone/core-player/CurrentPlayerRegistry';
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
import ApolloProgram from '@civ-clone/base-wonder-apolloprogram/ApolloProgram';
import { BuildableInstance } from '@civ-clone/core-city-build/Buildable';
import BuildingComplete from '@civ-clone/core-city-build/Rules/BulidingComplete';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Part from '@civ-clone/core-spaceship/Part';
import Player from '@civ-clone/core-player/Player';
import Spaceship from '@civ-clone/core-spaceship/Spaceship';

export const getRules = (
  currentPlayerRegistry: CurrentPlayerRegistry = currentPlayerRegistryInstance,
  spaceshipRegistry: SpaceshipRegistry = spaceshipRegistryInstance,
  layoutRegistry: LayoutRegistry = layoutRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  turn: Turn = turnInstance,
  randomNumberGenerator: () => number = () => Math.random()
): BuildingComplete[] => [
  new BuildingComplete(
    new Criterion(
      (cityBuild: CityBuild, buildItem: BuildableInstance): buildItem is Part =>
        buildItem instanceof ApolloProgram
    ),
    new Effect(() => {
      // TODO: if there is more than one layout, ask the player to choose.
      const [layout] = layoutRegistry.entries();

      currentPlayerRegistry
        .entries()
        .forEach((player: Player) =>
          spaceshipRegistry.register(
            new Spaceship(
              player,
              layout,
              ruleRegistry,
              turn,
              randomNumberGenerator
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
