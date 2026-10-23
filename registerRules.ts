import { deriveBuildRules, notLaunchedRule } from './Rules/City/build';
import {
  describedRequirements,
  requiresAdvance,
  requiresWonder,
} from './Requirements';
import cityBuildCost from './Rules/City/build-cost';
import cityBuildingComplete from './Rules/City/building-complete';
import cityCaptured from './Rules/City/captured';
import citySpend from './Rules/City/spend';
import playerAction from './Rules/Player/action';
import playerDefeated from './Rules/Player/defeated';
import spaceshipActive from './Rules/Spaceship/active';
import spaceshipBuilt from './Rules/Spaceship/built';
import spaceshipChanceOfSuccess from './Rules/Spaceship/chance-of-success';
import spaceshipChooseSlot from './Rules/Spaceship/choose-slot';
import spaceshipFlightTime from './Rules/Spaceship/flight-time';
import spaceshipLanded from './Rules/Spaceship/landed';
import spaceshipLost from './Rules/Spaceship/lost';
import spaceshipYield from './Rules/Spaceship/yield';
import turnEnd from './Rules/Turn/end';
import turnStart from './Rules/Turn/start';
import { Game, defaultGame } from '@civ-clone/core-game';

export const register = (game: Game): void => {
  const deriveBuildRule = deriveBuildRules(game.wonders, game.playerResearch);

  // Which parts a city may build, from the entries in `Requirements`, around the hand-written rule for an unlaunched
  //  spaceship: each rule lands where it always was, first among this package's rules, so nothing moves in the order
  //  rules run (civ-clone/web-renderer#37).
  game.requirements.add(deriveBuildRule, ...requiresWonder);
  game.rules.register(notLaunchedRule(game.spaceships));
  game.requirements.add(deriveBuildRule, ...requiresAdvance);
  game.requirements.add(null, ...describedRequirements);

  game.rules.register(
    ...cityBuildCost(),
    ...cityBuildingComplete(
      game.players,
      game.spaceships,
      game.layouts,
      game.rules,
      game.turn,
      game.year
    ),
    ...cityCaptured(game.cityImprovements, game.spaceships),
    ...citySpend(),
    ...playerAction(game.spaceships),
    ...playerDefeated(game.spaceships),
    ...spaceshipActive(),
    ...spaceshipBuilt(game.engine),
    ...spaceshipChanceOfSuccess(),
    ...spaceshipChooseSlot(),
    ...spaceshipFlightTime(),
    ...spaceshipLanded(game.engine),
    ...spaceshipLost(
      game.spaceships,
      game.layouts,
      game.rules,
      game.turn,
      game.year,
      game.engine
    ),
    ...spaceshipYield(),
    ...turnEnd(game.spaceships, game.players),
    ...turnStart(
      game.spaceships,
      game.layouts,
      game.rules,
      game.turn,
      game.year,
      game.cities,
      game.cityBuilds,
      game.players,
      game.wonders
    )
  );
};

// The plugin loader imports each package for this side effect. Until it passes
// a `Game` of its own, dropping it would produce a game with silently absent
// rules — no error, just wrong behaviour.
register(defaultGame);

export default register;
