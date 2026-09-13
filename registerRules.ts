import cityBuild from './Rules/City/build';
import cityBuildCost from './Rules/City/build-cost';
import cityBuildingComplete from './Rules/City/building-complete';
import citySpend from './Rules/City/spend';
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
import { Game, defaultGame } from '@civ-clone/core-game';

export const register = (game: Game): void =>
  game.rules.register(
    ...cityBuild(game.wonders, game.playerResearch, game.spaceships),
    ...cityBuildCost(),
    ...cityBuildingComplete(
      game.currentPlayers,
      game.spaceships,
      game.layouts,
      game.rules,
      game.turn,
      game.year,
      game.rng
    ),
    ...citySpend(),
    ...playerAction(game.spaceships),
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
      game.engine,
      game.rng
    ),
    ...spaceshipYield(),
    ...turnStart(game.spaceships)
  );

// The plugin loader imports each package for this side effect. Until it passes
// a `Game` of its own, dropping it would produce a game with silently absent
// rules — no error, just wrong behaviour.
register(defaultGame);

export default register;
