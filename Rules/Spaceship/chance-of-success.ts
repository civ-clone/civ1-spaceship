import { Energy, LifeSupport, Population } from '../../Yields';
import { Fuel, Propulsion } from '../../Parts';
import ChanceOfSuccess from '@civ-clone/core-spaceship/Rules/ChanceOfSuccess';
import Effect from '@civ-clone/core-rule/Effect';
import Part from '@civ-clone/core-spaceship/Part';
import Spaceship from '@civ-clone/core-spaceship/Spaceship';
import YieldValue from '@civ-clone/core-yield/Yield';

export const getRules = (): ChanceOfSuccess[] => [
  new ChanceOfSuccess(
    new Effect((spaceship: Spaceship) => {
      const [
        totalEnergy,
        requiredEnergy,
        totalLifeSupport,
        requiredLifeSupport,
        population,
      ] = spaceship.yields().reduce(
        (
          [
            totalEnergy,
            requiredEnergy,
            totalLifeSupport,
            requiredLifeSupport,
            population,
          ],
          shipYield: YieldValue
        ) => {
          if (shipYield instanceof Energy && shipYield.value() > 0) {
            totalEnergy += shipYield.value();
          }

          if (shipYield instanceof Energy && shipYield.value() < 0) {
            requiredEnergy += Math.abs(shipYield.value());
          }

          if (shipYield instanceof LifeSupport && shipYield.value() > 0) {
            totalLifeSupport += shipYield.value();
          }

          if (shipYield instanceof LifeSupport && shipYield.value() < 0) {
            requiredLifeSupport += Math.abs(shipYield.value());
          }

          if (shipYield instanceof Population) {
            population += shipYield.value();
          }

          return [
            totalEnergy,
            requiredEnergy,
            totalLifeSupport,
            requiredLifeSupport,
            population,
          ];
        },
        [0, 0, 0, 0, 0]
      );

      const [totalFuel, totalPropulsion] = spaceship.activeParts().reduce(
        ([totalFuel, totalPropulsion], part: Part) => {
          if (part instanceof Fuel) {
            totalFuel++;
          }

          if (part instanceof Propulsion) {
            totalPropulsion++;
          }

          return [totalFuel, totalPropulsion];
        },
        [0, 0]
      );

      if (
        [
          totalEnergy,
          totalLifeSupport,
          population,
          totalFuel,
          totalPropulsion,
        ].some((value) => value === 0)
      ) {
        return 0;
      }

      const fuelToPropulsionRatio = Math.min(totalFuel / totalPropulsion, 1),
        lifeSupportRatio = Math.min(requiredLifeSupport / totalLifeSupport, 1),
        energyRatio = Math.min(requiredEnergy / totalEnergy, 1);

      return fuelToPropulsionRatio * lifeSupportRatio * energyRatio;
    })
  ),
];

export default getRules;
