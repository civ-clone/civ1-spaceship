import ChooseSlotRule from '@civ-clone/core-spaceship/Rules/ChooseSlot';
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
