"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const BuildCost_1 = require("@civ-clone/core-city-build/Rules/BuildCost");
const Parts_1 = require("../../Parts");
const getRules = () => [
    ...[
        [Parts_1.Fuel, 160],
        [Parts_1.Habitation, 320],
        [Parts_1.LifeSupport, 320],
        [Parts_1.Power, 320],
        [Parts_1.Propulsion, 160],
        [Parts_1.Structural, 80],
    ].flatMap(([PartType, cost]) => (0, BuildCost_1.buildCost)(PartType, cost)),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=build-cost.js.map