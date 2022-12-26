"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const SpaceshipRegistry_1 = require("@civ-clone/core-spaceship/SpaceshipRegistry");
const Action_1 = require("@civ-clone/core-player/Rules/Action");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const LaunchSpaceship_1 = require("@civ-clone/base-player-action-launch-spaceship/LaunchSpaceship");
const getRules = (spaceshipRegistry = SpaceshipRegistry_1.instance) => [
    new Action_1.default(new Criterion_1.default((player) => spaceshipRegistry.getActiveByPlayer(player) !== null), new Effect_1.default((player) => [
        new LaunchSpaceship_1.default(player, spaceshipRegistry.getActiveByPlayer(player)),
    ])),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=action.js.map