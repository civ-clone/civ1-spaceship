"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const SpaceshipRegistry_1 = require("@civ-clone/core-spaceship/SpaceshipRegistry");
const Defeated_1 = require("@civ-clone/core-player/Rules/Defeated");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const cancelSpaceship_1 = require("../../lib/cancelSpaceship");
const getRules = (spaceshipRegistry = SpaceshipRegistry_1.instance) => [
    // A civilization destroyed loses its spaceship too, so a ship in flight can't land for a player who is gone.
    new Defeated_1.default('civ1-spaceship:player/defeated/cancel-spaceship', new Effect_1.default((player) => (0, cancelSpaceship_1.default)(player, spaceshipRegistry))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=defeated.js.map