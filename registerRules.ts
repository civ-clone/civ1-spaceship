import cityBuild from './Rules/City/build';
import cityBuildCost from './Rules/City/build-cost';
import cityBuildingComplete from './Rules/City/building-complete';
import citySpend from './Rules/City/spend';
import { instance as ruleRegistryInstance } from '@civ-clone/core-rule/RuleRegistry';
import playerAction from './Rules/Player/action';
import spaceshipActive from './Rules/Spaceship/active';
import spaceshipBuilt from './Rules/Spaceship/built';
import spaceshipChanceOfSuccess from './Rules/Spaceship/chance-of-success';
import spaceshipChooseSlot from './Rules/Spaceship/choose-slot';
import spaceshipFlightTime from './Rules/Spaceship/flight-time';
import spaceshipLanded from './Rules/Spaceship/landed';
import spaceshipLost from './Rules/Spaceship/lost';
import spaceshipYield from './Rules/Spaceship/yield';
import turnStart from './Rules/Turn/start';

ruleRegistryInstance.register(
  ...cityBuild(),
  ...cityBuildCost(),
  ...cityBuildingComplete(),
  ...citySpend(),
  ...playerAction(),
  ...spaceshipActive(),
  ...spaceshipBuilt(),
  ...spaceshipChanceOfSuccess(),
  ...spaceshipChooseSlot(),
  ...spaceshipFlightTime(),
  ...spaceshipLanded(),
  ...spaceshipLost(),
  ...spaceshipYield(),
  ...turnStart()
);
