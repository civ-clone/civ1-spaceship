"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const SpaceshipRegistry_1 = require("@civ-clone/core-spaceship/SpaceshipRegistry");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Start_1 = require("@civ-clone/core-turn-based-game/Rules/Start");
const getRules = (spaceshipRegistry = SpaceshipRegistry_1.instance) => [
    new Start_1.default(new Effect_1.default(() => {
        spaceshipRegistry
            .entries()
            .forEach((spaceship) => spaceship.check());
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=start.js.map