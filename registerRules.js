"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const build_1 = require("./Rules/City/build");
const Requirements_1 = require("./Requirements");
const build_cost_1 = require("./Rules/City/build-cost");
const building_complete_1 = require("./Rules/City/building-complete");
const captured_1 = require("./Rules/City/captured");
const action_1 = require("./Rules/Player/action");
const defeated_1 = require("./Rules/Player/defeated");
const active_1 = require("./Rules/Spaceship/active");
const built_1 = require("./Rules/Spaceship/built");
const chance_of_success_1 = require("./Rules/Spaceship/chance-of-success");
const choose_slot_1 = require("./Rules/Spaceship/choose-slot");
const flight_time_1 = require("./Rules/Spaceship/flight-time");
const landed_1 = require("./Rules/Spaceship/landed");
const lost_1 = require("./Rules/Spaceship/lost");
const yield_1 = require("./Rules/Spaceship/yield");
const end_1 = require("./Rules/Turn/end");
const start_1 = require("./Rules/Turn/start");
const core_game_1 = require("@civ-clone/core-game");
const register = (game) => {
    const deriveBuildRule = (0, build_1.deriveBuildRules)(game.wonders, game.playerResearch);
    // Which parts a city may build, from the entries in `Requirements`, around the hand-written rule for an unlaunched
    //  spaceship: each rule lands where it always was, first among this package's rules, so nothing moves in the order
    //  rules run (civ-clone/web-renderer#37).
    game.requirements.add(deriveBuildRule, ...Requirements_1.requiresWonder);
    game.rules.register((0, build_1.notLaunchedRule)(game.spaceships));
    game.requirements.add(deriveBuildRule, ...Requirements_1.requiresAdvance);
    game.requirements.add(null, ...Requirements_1.describedRequirements);
    game.rules.register(...(0, build_cost_1.default)(), ...(0, building_complete_1.default)(game.players, game.spaceships, game.layouts, game.rules, game.turn, game.year), ...(0, captured_1.default)(game.cityImprovements, game.spaceships), ...(0, action_1.default)(game.spaceships), ...(0, defeated_1.default)(game.spaceships), ...(0, active_1.default)(), ...(0, built_1.default)(game.engine), ...(0, chance_of_success_1.default)(), ...(0, choose_slot_1.default)(), ...(0, flight_time_1.default)(), ...(0, landed_1.default)(game.engine), ...(0, lost_1.default)(game.spaceships, game.layouts, game.rules, game.turn, game.year, game.engine), ...(0, yield_1.default)(), ...(0, end_1.default)(game.spaceships, game.players), ...(0, start_1.default)(game.spaceships, game.layouts, game.rules, game.turn, game.year, game.cities, game.cityBuilds, game.players, game.wonders));
};
exports.register = register;
// The plugin loader imports each package for this side effect. Until it passes
// a `Game` of its own, dropping it would produce a game with silently absent
// rules — no error, just wrong behaviour.
(0, exports.register)(core_game_1.defaultGame);
exports.default = exports.register;
//# sourceMappingURL=registerRules.js.map