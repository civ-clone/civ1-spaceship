import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { SpaceshipRegistry } from '@civ-clone/core-spaceship/SpaceshipRegistry';
import Captured from '@civ-clone/core-city/Rules/Captured';
export declare const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry,
  spaceshipRegistry?: SpaceshipRegistry
) => Captured[];
export default getRules;
