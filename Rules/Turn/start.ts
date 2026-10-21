import {
  CityBuildRegistry,
  instance as cityBuildRegistryInstance,
} from '@civ-clone/core-city-build/CityBuildRegistry';
import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  PlayerRegistry,
  instance as playerRegistryInstance,
} from '@civ-clone/core-player/PlayerRegistry';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
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
import ApolloProgram from '@civ-clone/base-wonder-apolloprogram/ApolloProgram';
import ChooseSlot from '@civ-clone/core-spaceship/Rules/ChooseSlot';
import City from '@civ-clone/core-city/City';
import Player from '@civ-clone/core-player/Player';
import Default from '@civ-clone/civ1-default-spaceship-layout/Default';
import Effect from '@civ-clone/core-rule/Effect';
import Layout from '@civ-clone/core-spaceship/Layout';
import Part from '@civ-clone/core-spaceship/Part';
import Slot from '@civ-clone/core-spaceship/Slot';
import Spaceship from '@civ-clone/core-spaceship/Spaceship';
import Start from '@civ-clone/core-turn-based-game/Rules/Start';

export const getRules = (
  spaceshipRegistry: SpaceshipRegistry = spaceshipRegistryInstance,
  layoutRegistry: LayoutRegistry = layoutRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  turn: Turn = turnInstance,
  year: Year = yearInstance,
  cityRegistry: CityRegistry = cityRegistryInstance,
  cityBuildRegistry: CityBuildRegistry = cityBuildRegistryInstance,
  playerRegistry: PlayerRegistry = playerRegistryInstance,
  wonderRegistry: WonderRegistry = wonderRegistryInstance
): Start[] => [
  // Before 0.1.3 the Apollo Program gave every player's ship the same layout, so each player's parts went into all of
  //  them. A game saved then shares it still: each ship still being built gets a layout of its own, with the parts
  //  its player's cities built. A ship in flight keeps what it launched with.
  new Start(
    'civ1-spaceship:turn/start/own-layouts',
    new Effect((): void => {
      const spaceships = spaceshipRegistry.entries(),
        shared = spaceships.filter(
          (spaceship: Spaceship): boolean =>
            spaceship.successful() === null &&
            spaceship.launched() === false &&
            spaceships.some(
              (other: Spaceship): boolean =>
                other !== spaceship && other.layout() === spaceship.layout()
            )
        );

      shared.forEach((spaceship: Spaceship): void => {
        const [LayoutType] = layoutRegistry.entries() as (typeof Default)[],
          replacement = new Spaceship(
            spaceship.player(),
            new LayoutType(ruleRegistry),
            ruleRegistry,
            turn,
            year
          );

        spaceship
          .layout()
          .slots()
          .map((slot: Slot): Part | null => slot.part())
          .filter(
            (part: Part | null): part is Part =>
              part !== null && part.city().player() === spaceship.player()
          )
          .forEach((part: Part): void => {
            const [slot] = ruleRegistry.process(
              ChooseSlot,
              part,
              replacement.layout() as Layout
            );

            slot?.fill(part);
          });

        spaceshipRegistry.unregister(spaceship);
        spaceshipRegistry.register(replacement);
      });
    })
  ),

  // A ship can't change in flight, so its player's cities stop building parts for it (they would only be left behind),
  //  before this turn's shields go into them.
  new Start(
    'civ1-spaceship:turn/start/stop-parts-in-flight',
    new Effect((): void =>
      spaceshipRegistry
        .entries()
        .filter(
          (spaceship: Spaceship): boolean =>
            spaceship.successful() === null && spaceship.launched() !== false
        )
        .forEach((spaceship: Spaceship): void =>
          cityRegistry
            .getByPlayer(spaceship.player())
            .map((city: City) => cityBuildRegistry.getByCity(city))
            .filter(
              (cityBuild) =>
                cityBuild.building()?.item().prototype instanceof Part
            )
            .forEach((cityBuild) => cityBuild.revalidate())
        )
    )
  ),

  // The Apollo Program gives a ship to every player there is when it's built. One who comes into the game later (a
  //  destroyed civilization coming back, #178) gets one too.
  new Start(
    'civ1-spaceship:turn/start/ships-for-newcomers',
    new Effect((): void => {
      if (
        !wonderRegistry
          .entries()
          .some((wonder): boolean => wonder instanceof ApolloProgram)
      ) {
        return;
      }

      playerRegistry
        .entries()
        .filter(
          (player: Player): boolean =>
            spaceshipRegistry.getBy('player', player).length === 0
        )
        .forEach((player: Player): void => {
          const [LayoutType] = layoutRegistry.entries() as (typeof Default)[];

          spaceshipRegistry.register(
            new Spaceship(
              player,
              new LayoutType(ruleRegistry),
              ruleRegistry,
              turn,
              year
            )
          );
        });
    })
  ),
];

export default getRules;
