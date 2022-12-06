import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import SpaceshipRegistry from '@civ-clone/core-spaceship/SpaceshipRegistry';
import chanceOfSuccess from '../Rules/Spaceship/chance-of-success';
import flightTime from '../Rules/Spaceship/flight-time';
import lost from '../Rules/Spaceship/lost';
import validate from '../Rules/Spaceship/validate';
import partYield from '../Rules/Spaceship/yield';
import Player from '@civ-clone/core-player/Player';
import Spaceship from '@civ-clone/core-spaceship/Spaceship';
import {
  Fuel,
  Habitation,
  Power,
  Propulsion,
  Structural,
  LifeSupport as LifeSupportPart,
} from '../Parts';
import Part from '@civ-clone/core-spaceship/Part';
import { setUpCity } from '@civ-clone/civ1-city/tests/lib/setUpCity';
import { expect } from 'chai';
import { reduceYields } from '@civ-clone/core-yield/lib/reduceYields';
import { Energy, LifeSupport, Mass, Population } from '../Yields';
import defaultLayout from '../Layouts/default';
import chooseSlot from '../Rules/Spaceship/choose-slot';
import Slot from '@civ-clone/core-spaceship/Slot';
import reduceYieldWithUsed from '../lib/reduceYieldWithUsed';

describe('Spaceship', () => {
  it('should return expected values depending on the added components', async () => {
    const ruleRegistry = new RuleRegistry(),
      spaceshipRegistry = new SpaceshipRegistry(),
      city = await setUpCity({
        ruleRegistry,
      });

    ruleRegistry.register(
      ...chanceOfSuccess(),
      ...chooseSlot(),
      ...flightTime(),
      ...lost(spaceshipRegistry, undefined, ruleRegistry),
      ...validate(),
      ...partYield()
    );

    (
      [
        // expectedNumberOfParts,
        // expectedMass,
        // expectedEnergy,
        // expectedPopulation,
        // expectedLifeSupport,
        // expectedFuel,
        // expectedPropulsion,
        // expectedChanceOfSuccess,
        // expectedFlightTime,
        [[[Structural, 34]], 34, 3400, 0, 0, 0, 0, 0, 170],
        [[[Structural, 38]], 34, 3400, 0, 0, 0, 0, 0, 170],
        [
          [
            [Structural, 34],
            [Fuel, 8],
            [Propulsion, 8],
            [Habitation, 4],
            [LifeSupportPart, 4],
            [Power, 4],
          ],
          62,
          24200,
          1,
          40000,
          1,
          1,
          1,
          14.9,
        ],
      ] as [
        [typeof Part, number][],
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number
      ][]
    ).forEach(
      ([
        components,
        expectedNumberOfParts,
        expectedMass,
        expectedEnergy,
        expectedPopulation,
        expectedLifeSupport,
        expectedFuel,
        expectedChanceOfSuccess,
        expectedFlightTime,
      ]) => {
        const player = new Player(ruleRegistry),
          [layout] = defaultLayout(),
          spaceship = new Spaceship(player, layout, ruleRegistry);

        spaceshipRegistry.register(spaceship);

        components.forEach(([PartType, number]) => {
          for (let i = 0; i < number; i++) {
            spaceship.add(new PartType(city, ruleRegistry));
          }
        });

        expect(spaceship.parts().length, 'number of parts').eq(
          expectedNumberOfParts
        );

        const spaceshipYields = spaceship.yields(),
          [mass, population] = reduceYields(spaceshipYields, Mass, Population),
          [energy, energyRequired] = reduceYieldWithUsed(
            spaceshipYields,
            Energy
          ),
          energyPercentage =
            energy === 0 ? 0 : Math.min(1, energyRequired / energy),
          [lifeSupport, lifeSupportRequired] = reduceYieldWithUsed(
            spaceshipYields,
            LifeSupport
          ),
          lifeSupportPercentage =
            lifeSupport === 0
              ? 0
              : Math.min(1, lifeSupportRequired / lifeSupport),
          [fuel, propulsion] = spaceship.parts().reduce(
            ([fuel, propulsion], part: Part) => {
              if (part instanceof Fuel) {
                fuel += 1;
              }

              if (part instanceof Propulsion) {
                propulsion += 1;
              }

              return [fuel, propulsion];
            },
            [0, 0]
          ),
          fuelPercentage = fuel === 0 ? 0 : propulsion / fuel;

        expect(mass, 'mass').eq(expectedMass);
        expect(energyPercentage, 'energy').eq(expectedEnergy);
        expect(population, 'population').eq(expectedPopulation);
        expect(lifeSupportPercentage, 'life support').eq(expectedLifeSupport);
        expect(fuelPercentage, 'fuel').eq(expectedFuel);
        expect(spaceship.flightTime(), 'flight time').eq(expectedFlightTime);
        expect(spaceship.chanceOfSuccess(), 'chance of success').eq(
          expectedChanceOfSuccess
        );

        spaceshipRegistry.unregister(spaceship);
      }
    );
  });

  it('should choose a slot near the middle at the bottom of the ship when there are no existing `Part`s', async () => {
    const ruleRegistry = new RuleRegistry(),
      spaceshipRegistry = new SpaceshipRegistry(),
      city = await setUpCity({
        ruleRegistry,
      });

    ruleRegistry.register(
      ...chanceOfSuccess(),
      ...chooseSlot(),
      ...flightTime(),
      ...lost(spaceshipRegistry, undefined, ruleRegistry),
      ...validate(),
      ...partYield()
    );

    const player = new Player(ruleRegistry),
      [layout] = defaultLayout(),
      spaceship = new Spaceship(player, layout, ruleRegistry);

    spaceshipRegistry.register(spaceship);

    (
      [
        [Structural, 8, 7],
        [Structural, 8, 4],
        [Fuel, 9, 6],
        [Propulsion, 10, 6],
        [Habitation, 6, 4],
        [LifeSupportPart, 6, 6],
      ] as [typeof Part, number, number][]
    ).forEach(([PartType, x, y]) => {
      const part = new PartType(city, ruleRegistry);

      spaceship.add(part);

      const [usedSlot] = spaceship
        .layout()
        .slots()
        .filter((slot: Slot) => slot.part() === part);

      expect([usedSlot.x(), usedSlot.y()]).eql([x, y]);
    });
  });
});
