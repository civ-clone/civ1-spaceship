import ApolloProgram from '@civ-clone/base-wonder-apolloprogram/ApolloProgram';
import ChooseSlotRule from '@civ-clone/core-spaceship/Rules/ChooseSlot';
import PlayerRegistry from '@civ-clone/core-player/PlayerRegistry';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import Default from '@civ-clone/civ1-default-spaceship-layout/Default';
import Effect from '@civ-clone/core-rule/Effect';
import LayoutRegistry from '@civ-clone/core-spaceship/LayoutRegistry';
import Part from '@civ-clone/core-spaceship/Part';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Slot from '@civ-clone/core-spaceship/Slot';
import Spaceship from '@civ-clone/core-spaceship/Spaceship';
import SpaceshipRegistry from '@civ-clone/core-spaceship/SpaceshipRegistry';
import Start from '@civ-clone/core-turn-based-game/Rules/Start';
import { Structural } from '../Parts';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import Year from '@civ-clone/core-game-year/Year';
import YearRule from '@civ-clone/core-game-year/Rules/Year';
import active from '../Rules/Spaceship/active';
import chooseSlot from '../Rules/Spaceship/choose-slot';
import { expect } from 'chai';
import { setUpCity } from '@civ-clone/civ1-city/tests/lib/setUpCity';
import turnStart from '../Rules/Turn/start';

describe('ships sharing a layout', (): void => {
  it("gives each ship being built a layout of its own, with its own player's parts, and leaves a launched one", async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      spaceshipRegistry = new SpaceshipRegistry(),
      layoutRegistry = new LayoutRegistry(),
      turn = new Turn(),
      year = new Year(turn, ruleRegistry),
      [ours, theirs, flying] = await Promise.all([
        setUpCity({ ruleRegistry }),
        setUpCity({ ruleRegistry }),
        setUpCity({ ruleRegistry }),
      ]),
      shared = new Default(ruleRegistry),
      place = (part: Part) => {
        const [slot] = ruleRegistry.process(ChooseSlotRule, part, shared);

        slot.fill(part);
      };

    layoutRegistry.register(Default);
    ruleRegistry.register(
      ...active(),
      ...chooseSlot(),
      new YearRule(new Effect((turn: number) => turn)),
      ...turnStart(spaceshipRegistry, layoutRegistry, ruleRegistry, turn, year)
    );

    const ourShip = new Spaceship(
        ours.player(),
        shared,
        ruleRegistry,
        turn,
        year
      ),
      theirShip = new Spaceship(
        theirs.player(),
        shared,
        ruleRegistry,
        turn,
        year
      ),
      flyingShip = new Spaceship(
        flying.player(),
        shared,
        ruleRegistry,
        turn,
        year
      );

    spaceshipRegistry.register(ourShip, theirShip, flyingShip);

    place(new Structural(ours, ruleRegistry));
    place(new Structural(ours, ruleRegistry));
    place(new Structural(theirs, ruleRegistry));

    // As though launched: with only Structurals on it, its flight would never end.
    (flyingShip as unknown as { _launched: number })._launched = 0;

    ruleRegistry.process(Start, turn);

    const partsOf = (spaceship: Spaceship | null) =>
      spaceship!
        .layout()
        .slots()
        .map((slot: Slot) => slot.part())
        .filter((part) => part !== null)
        .map((part) => part!.city());

    const ourNew = spaceshipRegistry.getActiveByPlayer(ours.player()),
      theirNew = spaceshipRegistry.getActiveByPlayer(theirs.player());

    expect(ourNew).to.not.equal(ourShip);
    expect(ourNew!.layout()).to.not.equal(theirNew!.layout());
    expect(partsOf(ourNew)).to.deep.equal([ours, ours]);
    expect(partsOf(theirNew)).to.deep.equal([theirs]);
    expect(spaceshipRegistry.includes(flyingShip)).to.equal(true);
    expect(flyingShip.layout()).to.equal(shared);

    // Nothing shares any more, so another turn changes nothing.
    ruleRegistry.process(Start, turn);

    expect(spaceshipRegistry.getActiveByPlayer(ours.player())).to.equal(ourNew);
  });
});

describe('turn start', (): void => {
  const setUp = () => {
    const ruleRegistry = new RuleRegistry(),
      spaceshipRegistry = new SpaceshipRegistry(),
      layoutRegistry = new LayoutRegistry(),
      turn = new Turn(),
      year = new Year(turn, ruleRegistry);

    layoutRegistry.register(Default);
    ruleRegistry.register(
      ...active(),
      ...chooseSlot(),
      new YearRule(new Effect((turn: number) => turn))
    );

    return { layoutRegistry, ruleRegistry, spaceshipRegistry, turn, year };
  };

  it('separates a ship being built from a launched one it shares a layout with', async (): Promise<void> => {
    const { layoutRegistry, ruleRegistry, spaceshipRegistry, turn, year } =
        setUp(),
      [ours, theirs] = await Promise.all([
        setUpCity({ ruleRegistry }),
        setUpCity({ ruleRegistry }),
      ]),
      shared = new Default(ruleRegistry),
      building = new Spaceship(ours.player(), shared, ruleRegistry, turn, year),
      flying = new Spaceship(theirs.player(), shared, ruleRegistry, turn, year);

    ruleRegistry.register(
      ...turnStart(spaceshipRegistry, layoutRegistry, ruleRegistry, turn, year)
    );
    spaceshipRegistry.register(building, flying);
    (flying as unknown as { _launched: number })._launched = 0;

    ruleRegistry.process(Start, turn);

    expect(spaceshipRegistry.getActiveByPlayer(ours.player())).to.not.equal(
      building
    );
    expect(
      spaceshipRegistry.getActiveByPlayer(ours.player())!.layout()
    ).to.not.equal(shared);
  });

  it('gives a ship to a player who came into the game after the Apollo Program', async (): Promise<void> => {
    const { layoutRegistry, ruleRegistry, spaceshipRegistry, turn, year } =
        setUp(),
      city = await setUpCity({ ruleRegistry }),
      newcomer = city.player(),
      wonderRegistry = new WonderRegistry(),
      playerRegistry = new PlayerRegistry();

    playerRegistry.register(newcomer);
    ruleRegistry.register(
      ...turnStart(
        spaceshipRegistry,
        layoutRegistry,
        ruleRegistry,
        turn,
        year,
        undefined,
        undefined,
        playerRegistry,
        wonderRegistry
      )
    );

    ruleRegistry.process(Start, turn);

    expect(spaceshipRegistry.getActiveByPlayer(newcomer)).to.equal(null);

    wonderRegistry.register(new ApolloProgram(city, ruleRegistry));
    ruleRegistry.process(Start, turn);

    expect(spaceshipRegistry.getActiveByPlayer(newcomer)).to.not.equal(null);
  });

  it('stops the cities of a player whose ship is in flight building parts', async (): Promise<void> => {
    const { layoutRegistry, ruleRegistry, spaceshipRegistry, turn, year } =
        setUp(),
      city = await setUpCity({ ruleRegistry }),
      revalidated: string[] = [],
      spaceship = new Spaceship(
        city.player(),
        new Default(ruleRegistry),
        ruleRegistry,
        turn,
        year
      ),
      cityBuild = (Item: unknown, name: string) => ({
        building: () => ({ item: () => Item }),
        revalidate: () => revalidated.push(name),
      }),
      builds = [cityBuild(Structural, 'part'), cityBuild(Default, 'other')];

    ruleRegistry.register(
      ...turnStart(
        spaceshipRegistry,
        layoutRegistry,
        ruleRegistry,
        turn,
        year,
        { getByPlayer: () => [city, city] } as any,
        {
          getByCity: (() => {
            let index = 0;

            return () => builds[index++ % builds.length];
          })(),
        } as any
      )
    );
    spaceshipRegistry.register(spaceship);

    ruleRegistry.process(Start, turn);

    expect(revalidated).to.deep.equal([]);

    (spaceship as unknown as { _launched: number })._launched = 0;
    ruleRegistry.process(Start, turn);

    expect(revalidated).to.deep.equal(['part']);
  });
});
