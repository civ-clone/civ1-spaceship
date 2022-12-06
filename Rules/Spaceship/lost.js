"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const SpaceshipRegistry_1 = require("@civ-clone/core-spaceship/SpaceshipRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Lost_1 = require("@civ-clone/core-spaceship/Rules/Lost");
const Spaceship_1 = require("@civ-clone/core-spaceship/Spaceship");
const LayoutRegistry_1 = require("@civ-clone/core-spaceship/LayoutRegistry");
const getRules = (spaceshipRegistry = SpaceshipRegistry_1.instance, layoutRegistry = LayoutRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, turn = Turn_1.instance, randomNumberGenerator = () => Math.random()) => [
    new Lost_1.default(new Effect_1.default((spaceship) => {
        // TODO: if there is more than one layout, ask the player to choose.
        const [layout] = layoutRegistry.entries();
        spaceshipRegistry.register(new Spaceship_1.default(spaceship.player(), layout, ruleRegistry, turn, randomNumberGenerator));
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=lost.js.map