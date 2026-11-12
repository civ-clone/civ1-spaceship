import { Fuel, Structural } from '../Parts';
import AdvanceRegistry from '@civ-clone/core-science/AdvanceRegistry';
import ApolloProgram from '@civ-clone/base-wonder-apolloprogram/ApolloProgram';
import AvailableCityBuildItemsRegistry from '@civ-clone/core-city-build/AvailableCityBuildItemsRegistry';
import Buildable from '@civ-clone/core-city-build/Buildable';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import CityBuildRegistry from '@civ-clone/core-city-build/CityBuildRegistry';
import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import CityRegistry from '@civ-clone/core-city/CityRegistry';
import Default from '@civ-clone/civ1-default-spaceship-layout/Default';
import Engine from '@civ-clone/core-engine/Engine';
import LayoutRegistry from '@civ-clone/core-spaceship/LayoutRegistry';
import Player from '@civ-clone/core-player/Player';
import PlayerRegistry from '@civ-clone/core-player/PlayerRegistry';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import SpaceFlight from '@civ-clone/base-science-advance-spaceflight/SpaceFlight';
import Spaceship from '@civ-clone/core-spaceship/Spaceship';
import SpaceshipRegistry from '@civ-clone/core-spaceship/SpaceshipRegistry';
import Start from '@civ-clone/core-turn-based-game/Rules/Start';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import Year from '@civ-clone/core-game-year/Year';
import build, { buildRulesFor } from '../Rules/City/build';
import { table } from '@civ-clone/core-requirement/Requirement';
import { expect } from 'chai';
import improvementCreated from '@civ-clone/civ1-city-improvement/Rules/CityImprovement/created';
import improvementDestroyed from '@civ-clone/civ1-city-improvement/Rules/City/destroyed';
import { setUpCity } from '@civ-clone/civ1-city/tests/lib/setUpCity';
import turnStart from '../Rules/Turn/start';
import wonderDestroyed from '@civ-clone/civ1-wonder/Rules/City/destroyed';

// Parts need the Apollo Program to have been built, by anyone, ever: once lost with its city, it still counts
//  (civ-clone/web-renderer#971).

const setUp = async () => {
  const ruleRegistry = new RuleRegistry(),
    advanceRegistry = new AdvanceRegistry(),
    availableBuildItemsRegistry = new AvailableCityBuildItemsRegistry(),
    cityBuildRegistry = new CityBuildRegistry(),
    cityImprovementRegistry = new CityImprovementRegistry(),
    cityRegistry = new CityRegistry(),
    layoutRegistry = new LayoutRegistry(),
    playerRegistry = new PlayerRegistry(),
    playerResearchRegistry = new PlayerResearchRegistry(),
    spaceshipRegistry = new SpaceshipRegistry(),
    wonderRegistry = new WonderRegistry(),
    turn = new Turn(),
    year = new Year(turn, ruleRegistry);

  layoutRegistry.register(Default);
  advanceRegistry.register(SpaceFlight);
  availableBuildItemsRegistry.register(
    ...([Fuel, Structural] as unknown as (typeof Buildable)[])
  );

  ruleRegistry.register(
    ...improvementCreated(cityImprovementRegistry, {
      emit: (): void => {},
    } as unknown as Engine),
    ...improvementDestroyed(cityImprovementRegistry),
    ...wonderDestroyed(wonderRegistry),
    ...build(
      wonderRegistry,
      playerResearchRegistry,
      spaceshipRegistry,
      cityImprovementRegistry
    ),
    ...turnStart(
      spaceshipRegistry,
      layoutRegistry,
      ruleRegistry,
      turn,
      year,
      cityRegistry,
      cityBuildRegistry,
      playerRegistry,
      wonderRegistry,
      cityImprovementRegistry
    )
  );

  const apolloCity = await setUpCity({ ruleRegistry }),
    city = await setUpCity({
      ruleRegistry,
      tile: apolloCity.tile().getNeighbour('e'),
      world: apolloCity.tile().map(),
    }),
    playerResearch = new PlayerResearch(
      city.player(),
      advanceRegistry,
      ruleRegistry
    ),
    cityBuild = new CityBuild(city, availableBuildItemsRegistry, ruleRegistry);

  playerResearch.addAdvance(SpaceFlight);
  playerResearchRegistry.register(playerResearch);
  playerRegistry.register(apolloCity.player(), city.player());
  cityRegistry.register(apolloCity, city);
  cityBuildRegistry.register(cityBuild);

  const giveShips = (): void => {
      ruleRegistry.process(Start);
    },
    parts = (): Buildable[] =>
      cityBuild
        .available()
        .map((buildItem) => buildItem.item())
        .filter((Item) => Item === Structural || Item === Fuel),
    // As the Apollo Program is built: `Created` registers it among the improvements, and `civ1-wonder` among the
    //  Wonders.
    buildApollo = (): void => {
      wonderRegistry.register(new ApolloProgram(apolloCity, ruleRegistry));
    },
    shipOf = (player: Player): Spaceship | null =>
      spaceshipRegistry.getBy('player', player)[0] ?? null,
    // A ship, however the player came by it, so only the Apollo Program decides whether parts can be built.
    addShip = (player: Player): void =>
      spaceshipRegistry.register(
        new Spaceship(
          player,
          new Default(ruleRegistry),
          ruleRegistry,
          turn,
          year
        )
      );

  return {
    addShip,
    apolloCity,
    cityImprovementRegistry,
    playerResearchRegistry,
    buildApollo,
    city,
    giveShips,
    parts,
    playerRegistry,
    ruleRegistry,
    shipOf,
    wonderRegistry,
  };
};

describe('The Apollo Program, ever built', (): void => {
  it("should count in a `player` entry only while it stands in one of the player's cities", async (): Promise<void> => {
    const {
      addShip,
      city,
      cityImprovementRegistry,
      parts,
      playerResearchRegistry,
      ruleRegistry,
      wonderRegistry,
    } = await setUp();
    const home = await setUpCity({
      ruleRegistry,
      player: city.player(),
      tile: city.tile().getNeighbour('e'),
      world: city.tile().map(),
    });

    // A plugin's entry: parts need the Apollo Program in one of the player's own cities.
    ruleRegistry.register(
      ...table('test:player', 'requires', [[Structural, ApolloProgram]], {
        range: 'player',
      }).flatMap((entry) =>
        buildRulesFor(
          entry,
          wonderRegistry,
          playerResearchRegistry,
          cityImprovementRegistry
        )
      )
    );
    addShip(city.player());
    wonderRegistry.register(new ApolloProgram(home, ruleRegistry));

    expect(parts()).eql([Structural]);

    home.destroy();

    expect(parts()).eql([]);
  });

  it('should let parts be built, and give a newcomer a ship, once it has been lost with its city', async (): Promise<void> => {
    const {
      apolloCity,
      buildApollo,
      city,
      giveShips,
      parts,
      playerRegistry,
      ruleRegistry,
      shipOf,
      wonderRegistry,
    } = await setUp();

    buildApollo();
    giveShips();

    expect(shipOf(city.player())).instanceOf(Spaceship);
    expect(parts()).eql([Structural]);

    apolloCity.destroy();

    expect(wonderRegistry.entries()).eql([]);
    expect(parts()).eql([Structural]);

    // A civilization coming into the game since (a destroyed one coming back, civ-clone/web-renderer#178).
    const newcomer = new Player(ruleRegistry);

    playerRegistry.register(newcomer);
    giveShips();

    expect(shipOf(newcomer)).instanceOf(Spaceship);
  });

  it('should let no parts be built, and give no ship, while it has never been built', async (): Promise<void> => {
    const { addShip, apolloCity, city, giveShips, parts, shipOf } =
      await setUp();

    giveShips();

    expect(shipOf(city.player())).null;
    expect(shipOf(apolloCity.player())).null;

    addShip(city.player());

    expect(parts()).eql([]);
  });
});
