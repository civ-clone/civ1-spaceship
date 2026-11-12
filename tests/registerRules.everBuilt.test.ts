import { Fuel, Structural } from '../Parts';
import ApolloProgram from '@civ-clone/base-wonder-apolloprogram/ApolloProgram';
import Buildable from '@civ-clone/core-city-build/Buildable';
import City from '@civ-clone/core-city/City';
import Default from '@civ-clone/civ1-default-spaceship-layout/Default';
import { Game } from '@civ-clone/core-game/Game';
import Player from '@civ-clone/core-player/Player';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import Production from '@civ-clone/base-terrain-yield-production/Production';
import SpaceFlight from '@civ-clone/base-science-advance-spaceflight/SpaceFlight';
import Start from '@civ-clone/core-turn-based-game/Rules/Start';
import World from '@civ-clone/core-world/World';
import { expect } from 'chai';
import { instance as globalCityImprovements } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { instance as globalWonders } from '@civ-clone/core-wonder/WonderRegistry';
import registerCity from '@civ-clone/civ1-city/registerRules';
import registerCityImprovement from '@civ-clone/civ1-city-improvement/registerRules';
import registerSpaceship from '../registerRules';
import registerWonder from '@civ-clone/civ1-wonder/registerRules';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';

// This package's rules as `registerRules` registers them, in a game of their own whose registries are not the global
//  instances, as a host builds one: the Apollo Program lost in that game still counts (civ-clone/web-renderer#971).

describe('registerRules, with the Apollo Program lost', (): void => {
  it("should let parts be built, and give a newcomer a ship, from the game's own registries", async (): Promise<void> => {
    const game = new Game(),
      player = new Player(),
      rival = new Player();

    // As the plugin loader registers them: by name.
    [
      registerCity,
      registerCityImprovement,
      registerSpaceship,
      registerWonder,
    ].forEach((register: (game: Game) => void): void => register(game));

    game.layouts.register(Default);
    game.availableCityBuildItems.register(
      ...([ApolloProgram, Fuel, Structural] as unknown as (typeof Buildable)[])
    );

    [player, rival].forEach((owner: Player): void => {
      const research = new PlayerResearch(owner, game.advances, game.rules);

      game.players.register(owner);
      game.playerResearch.register(research);
      game.playerGovernments.register(
        new PlayerGovernment(owner, game.availableGovernments, game.rules)
      );
      research.addAdvance(SpaceFlight);
    });

    let world: World | undefined;

    const city = async (owner: Player, x: number, y: number): Promise<City> => {
        const city = await setUpCity({
          ruleRegistry: game.rules,
          player: owner,
          world,
          tile: world?.get(x, y),
          playerWorldRegistry: game.playerWorlds,
          tileImprovementRegistry: game.tileImprovements,
          cityGrowthRegistry: game.cityGrowth,
          workedTileRegistry: game.workedTiles,
        });

        world = city.tile().map() as World;

        return city;
      },
      home = await city(player, 2, 2),
      away = await city(rival, 0, 0),
      parts = (): string[] =>
        game.cityBuilds
          .getByCity(home)
          .available()
          .map((buildItem) => buildItem.item().name)
          .filter((name) => ['Fuel', 'Structural'].includes(name)),
      shipOf = (player: Player) =>
        game.spaceships.getBy('player', player)[0] ?? null,
      awayBuild = game.cityBuilds.getByCity(away);

    expect(parts()).eql([]);

    awayBuild.build(ApolloProgram as unknown as typeof Buildable);
    awayBuild.add(new Production(awayBuild.remaining()));
    awayBuild.check();

    expect(shipOf(player)).not.null;
    expect(parts()).eql(['Structural']);

    away.destroy();

    // Lost in this game, which no global registry knows of.
    expect(game.wonders.entries()).eql([]);
    expect(game.cityImprovements.getByType(ApolloProgram, true)).length(1);
    expect(globalCityImprovements.getByType(ApolloProgram, true)).eql([]);
    expect(globalWonders.entries()).eql([]);

    expect(parts()).eql(['Structural']);

    // A civilization coming into the game since (a destroyed one coming back, civ-clone/web-renderer#178).
    const newcomer = new Player();

    game.players.register(newcomer);
    game.rules.process(Start);

    expect(shipOf(newcomer)).not.null;
  });
});
