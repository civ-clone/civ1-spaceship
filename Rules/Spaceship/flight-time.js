"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const FlightTime_1 = require("@civ-clone/core-spaceship/Rules/FlightTime");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const reduceYields_1 = require("@civ-clone/core-yield/lib/reduceYields");
const Yields_1 = require("../../Yields");
const Parts_1 = require("../../Parts");
const getRules = () => [
    new FlightTime_1.default(new Effect_1.default((spaceship) => {
        const mass = (0, reduceYields_1.reduceYield)(spaceship.yields(), Yields_1.Mass), propulsion = spaceship
            .parts()
            .reduce((total, part) => total + (part instanceof Parts_1.Propulsion ? 1 : 0), 0);
        return Math.trunc((mass / 20 / (1 + propulsion * 10)) * 10) / 10;
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=flight-time.js.map