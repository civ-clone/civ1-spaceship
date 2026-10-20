import ApolloProgram from '@civ-clone/base-wonder-apolloprogram/ApolloProgram';
import BuildingComplete from '@civ-clone/core-city-build/Rules/BulidingComplete';
import Captured from '@civ-clone/core-city/Rules/Captured';
import City from '@civ-clone/core-city/City';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import Default from '@civ-clone/civ1-default-spaceship-layout/Default';
import Defeated from '@civ-clone/core-player/Rules/Defeated';
import Effect from '@civ-clone/core-rule/Effect';
import End from '@civ-clone/core-turn-based-game/Rules/End';
import Engine from '@civ-clone/core-engine/Engine';
import Landed from '@civ-clone/core-spaceship/Rules/Landed';
import LayoutRegistry from '@civ-clone/core-spaceship/LayoutRegistry';
import { Palace } from '@civ-clone/civ1-city-improvement/CityImprovements';
import Player from '@civ-clone/core-player/Player';
import PlayerRegistry from '@civ-clone/core-player/PlayerRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Spaceship from '@civ-clone/core-spaceship/Spaceship';
import SpaceshipRegistry from '@civ-clone/core-spaceship/SpaceshipRegistry';
import { Structural } from '../Parts';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import Year from '@civ-clone/core-game-year/Year';
import active from '../Rules/Spaceship/active';
import buildingComplete from '../Rules/City/building-complete';
import captured from '../Rules/City/captured';
import chooseSlot from '../Rules/Spaceship/choose-slot';
import defeated from '../Rules/Player/defeated';
import { expect } from 'chai';
import flightTime from '../Rules/Spaceship/flight-time';
import lost from '../Rules/Spaceship/lost';
import { setUpCity } from '@civ-clone/civ1-city/tests/lib/setUpCity';
import turnEnd from '../Rules/Turn/end';
import turnYear from '@civ-clone/civ1-game-year/Rules/Turn/year';

const setUp = () => {
  const ruleRegistry = new RuleRegistry(),
    spaceshipRegistry = new SpaceshipRegistry(),
    playerRegistry = new PlayerRegistry(),
    layoutRegistry = new LayoutRegistry(),
    cityImprovementRegistry = new CityImprovementRegistry(),
    engine = new Engine(),
    turn = new Turn(),
    year = new Year(turn, ruleRegistry),
    landed: Player[] = [],
    lostShips: [Player, boolean][] = [];

  layoutRegistry.register(Default);

  ruleRegistry.register(
    ...active(),
    ...chooseSlot(),
    ...flightTime(),
    ...lost(
      spaceshipRegistry,
      layoutRegistry,
      ruleRegistry,
      turn,
      year,
      engine
    ),
    ...turnEnd(spaceshipRegistry, playerRegistry),
    ...captured(cityImprovementRegistry, spaceshipRegistry),
    ...defeated(spaceshipRegistry),
    ...buildingComplete(
      playerRegistry,
      spaceshipRegistry,
      layoutRegistry,
      ruleRegistry,
      turn,
      year
    ),
    ...turnYear(),
    new Landed(
      new Effect((spaceship: Spaceship) => landed.push(spaceship.player()))
    )
  );

  engine.on('player:spaceship:lost', (player: Player, launched: boolean) =>
    lostShips.push([player, launched])
  );

  const addShip = (player: Player): Spaceship => {
    const spaceship = new Spaceship(
      player,
      new Default(ruleRegistry),
      ruleRegistry,
      turn,
      year
    );

    spaceshipRegistry.register(spaceship);

    return spaceship;
  };

  return {
    addShip,
    cityImprovementRegistry,
    landed,
    lostShips,
    playerRegistry,
    ruleRegistry,
    spaceshipRegistry,
    turn,
  };
};

describe('arrival', (): void => {
  it('lands a ship at the end of its arrival turn', (): void => {
    const { addShip, landed, playerRegistry, ruleRegistry, turn } = setUp(),
      player = new Player(ruleRegistry);

    playerRegistry.register(player);

    const spaceship = addShip(player);

    turn.set(300);
    spaceship.launch();

    expect(landed).to.deep.equal([]);

    turn.set(400);
    ruleRegistry.process(End, turn);

    expect(landed).to.deep.equal([player]);
    expect(spaceship.successful()).to.equal(true);
  });

  it("lands only the first player's ship when two arrive on the same turn", (): void => {
    const { addShip, landed, playerRegistry, ruleRegistry, turn } = setUp(),
      first = new Player(ruleRegistry),
      second = new Player(ruleRegistry);

    playerRegistry.register(first, second);

    // Registered the other way round, so the order comes from the players.
    const secondShip = addShip(second),
      firstShip = addShip(first);

    turn.set(300);
    secondShip.launch();
    firstShip.launch();

    turn.set(400);
    ruleRegistry.process(End, turn);

    expect(landed).to.deep.equal([first]);
    expect(secondShip.successful()).to.equal(null);

    ruleRegistry.process(End, turn);

    expect(landed).to.deep.equal([first, second]);
  });
});

describe('losing the capital', (): void => {
  const capture = async (
    withPalace: boolean,
    launch: boolean,
    parts: number
  ) => {
    const context = setUp(),
      { addShip, cityImprovementRegistry, ruleRegistry, turn } = context,
      city: City = await setUpCity({ ruleRegistry }),
      player = city.player(),
      captor = new Player(ruleRegistry),
      spaceship = addShip(player);

    if (withPalace) {
      cityImprovementRegistry.register(new Palace(city, ruleRegistry));
    }

    for (let i = 0; i < parts; i++) {
      spaceship.add(new Structural(city, ruleRegistry));
    }

    if (launch) {
      turn.set(300);
      spaceship.launch();
    }

    ruleRegistry.process(Captured, city, captor, player);

    return { ...context, player, spaceship };
  };

  it('sends a launched ship back to Earth', async (): Promise<void> => {
    const { lostShips, player, spaceship, spaceshipRegistry } = await capture(
      true,
      true,
      1
    );

    expect(spaceship.successful()).to.equal(false);
    expect(lostShips).to.deep.equal([[player, true]]);

    // The player can build another.
    const replacement = spaceshipRegistry.getActiveByPlayer(player);

    expect(replacement).to.not.equal(null);
    expect(replacement).to.not.equal(spaceship);
  });

  it('cancels a ship being built', async (): Promise<void> => {
    const { lostShips, player, spaceship } = await capture(true, false, 2);

    expect(spaceship.successful()).to.equal(false);
    expect(lostShips).to.deep.equal([[player, false]]);
  });

  it('leaves a ship with no parts, and any ship when the city is not the capital', async (): Promise<void> => {
    const empty = await capture(true, false, 0);

    expect(empty.spaceship.successful()).to.equal(null);
    expect(empty.lostShips).to.deep.equal([]);

    const notCapital = await capture(false, true, 1);

    expect(notCapital.spaceship.successful()).to.equal(null);
    expect(notCapital.lostShips).to.deep.equal([]);
  });
});

describe('a civilization destroyed', (): void => {
  it('loses its ship in flight', (): void => {
    const { addShip, lostShips, ruleRegistry, turn } = setUp(),
      player = new Player(ruleRegistry),
      spaceship = addShip(player);

    turn.set(300);
    spaceship.launch();

    ruleRegistry.process(Defeated, player, null);

    expect(spaceship.successful()).to.equal(false);
    expect(lostShips).to.deep.equal([[player, true]]);
  });
});

describe('the Apollo Program', (): void => {
  it('gives every civilization a ship of its own', async (): Promise<void> => {
    const { playerRegistry, ruleRegistry, spaceshipRegistry } = setUp(),
      city = await setUpCity({ ruleRegistry }),
      others = [new Player(ruleRegistry), new Player(ruleRegistry)];

    playerRegistry.register(city.player(), ...others);

    ruleRegistry.process(
      BuildingComplete,
      new CityBuild(city, undefined, ruleRegistry),
      new ApolloProgram(city, ruleRegistry)
    );

    const ships = [city.player(), ...others].map((player) =>
      spaceshipRegistry.getActiveByPlayer(player)
    );

    expect(ships.every((ship) => ship !== null)).to.equal(true);
    expect(new Set(ships.map((ship) => ship!.layout())).size).to.equal(3);
  });
});
