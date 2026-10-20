"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const SpaceshipRegistry_1 = require("@civ-clone/core-spaceship/SpaceshipRegistry");
const Captured_1 = require("@civ-clone/core-city/Rules/Captured");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const High_1 = require("@civ-clone/core-rule/Priorities/High");
const CityImprovements_1 = require("@civ-clone/civ1-city-improvement/CityImprovements");
const cancelSpaceship_1 = require("../../lib/cancelSpaceship");
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance, spaceshipRegistry = SpaceshipRegistry_1.instance) => [
    // Capturing a civilization's capital loses its spaceship (v474.05 `Actions.cs` L56-60). `High`, so the Palace is
    //  still there to find: `civ1-city-improvement`'s own `Captured` rule destroys it.
    new Captured_1.default('civ1-spaceship:city/captured/cancel-spaceship', new High_1.default(), new Criterion_1.default((capturedCity) => cityImprovementRegistry
        .getByCity(capturedCity)
        .some((cityImprovement) => cityImprovement instanceof CityImprovements_1.Palace)), new Effect_1.default((capturedCity, capturingPlayer, originalPlayer) => (0, cancelSpaceship_1.default)(originalPlayer, spaceshipRegistry))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=captured.js.map