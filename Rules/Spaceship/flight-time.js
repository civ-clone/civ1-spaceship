"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const Year_1 = require("@civ-clone/core-game-year/Year");
const FlightTime_1 = require("@civ-clone/core-spaceship/Rules/FlightTime");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Yields_1 = require("../../Yields");
const Parts_1 = require("../../Parts");
const reduceYields_1 = require("@civ-clone/core-yield/lib/reduceYields");
const getRules = (year = Year_1.instance, turn = Turn_1.instance) => [
    new FlightTime_1.default(new Effect_1.default((spaceship) => {
        const mass = (0, reduceYields_1.reduceYield)(spaceship.yields(), Yields_1.Mass), propulsion = spaceship
            .activeParts()
            .reduce((total, part) => total + (part instanceof Parts_1.Propulsion ? 1 : 0), 0), years = Math.trunc((mass / 20 / (1 + propulsion * 10)) * 10) / 10, currentYear = year.value(), targetYear = currentYear + years;
        let targetTurn = turn.value();
        // convert to whole `Turn`s
        while (year.value(targetTurn) < targetYear) {
            targetTurn++;
        }
        return targetTurn;
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=flight-time.js.map