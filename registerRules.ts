import cityBuild from './Rules/City/build';
import cityBuildCost from './Rules/City/build-cost';
import cityBuildingComplete from './Rules/City/building-complete';
import { instance as ruleRegistryInstance } from '@civ-clone/core-rule/RuleRegistry';
import playerAction from './Rules/Player/action';
import spaceshipBuilt from './Rules/Spaceship/built';
import spaceshipChanceOfSuccess from './Rules/Spaceship/chance-of-success';
import spaceshipChooseSlot from './Rules/Spaceship/choose-slot';
import spaceshipFlightTime from './Rules/Spaceship/flight-time';
import spaceshipLost from './Rules/Spaceship/lost';
import spaceshipYield from './Rules/Spaceship/yield';
import spaceshipValidate from './Rules/Spaceship/validate';

ruleRegistryInstance.register(
  ...cityBuild(),
  ...cityBuildCost(),
  ...cityBuildingComplete(),
  ...playerAction(),
  ...spaceshipBuilt(),
  ...spaceshipChanceOfSuccess(),
  ...spaceshipChooseSlot(),
  ...spaceshipFlightTime(),
  ...spaceshipLost(),
  ...spaceshipValidate(),
  ...spaceshipYield()
);
