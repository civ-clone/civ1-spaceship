import {
  Fuel,
  Habitation,
  LifeSupport,
  Power,
  Propulsion,
  Structural,
} from './Parts';
import { instance as availableBuildItemsRegistryInstance } from '@civ-clone/core-city-build/AvailableCityBuildItemsRegistry';

availableBuildItemsRegistryInstance.register(
  Fuel,
  Habitation,
  LifeSupport,
  Power,
  Propulsion,
  Structural
);
