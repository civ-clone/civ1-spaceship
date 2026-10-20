import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  SpaceshipRegistry,
  instance as spaceshipRegistryInstance,
} from '@civ-clone/core-spaceship/SpaceshipRegistry';
import Captured from '@civ-clone/core-city/Rules/Captured';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import High from '@civ-clone/core-rule/Priorities/High';
import { Palace } from '@civ-clone/civ1-city-improvement/CityImprovements';
import Player from '@civ-clone/core-player/Player';
import cancelSpaceship from '../../lib/cancelSpaceship';

export const getRules = (
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  spaceshipRegistry: SpaceshipRegistry = spaceshipRegistryInstance
): Captured[] => [
  // Capturing a civilization's capital loses its spaceship (v474.05 `Actions.cs` L56-60). `High`, so the Palace is
  //  still there to find: `civ1-city-improvement`'s own `Captured` rule destroys it.
  new Captured(
    'civ1-spaceship:city/captured/cancel-spaceship',
    new High(),
    new Criterion((capturedCity: City): boolean =>
      cityImprovementRegistry
        .getByCity(capturedCity)
        .some(
          (cityImprovement: CityImprovement): boolean =>
            cityImprovement instanceof Palace
        )
    ),
    new Effect(
      (
        capturedCity: City,
        capturingPlayer: Player,
        originalPlayer: Player
      ): void => cancelSpaceship(originalPlayer, spaceshipRegistry)
    )
  ),
];

export default getRules;
