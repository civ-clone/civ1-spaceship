"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Parts_1 = require("../../Parts");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Validate_1 = require("@civ-clone/core-spaceship/Rules/Validate");
const getRules = () => [
    ...[
        [Parts_1.Structural, 34],
        [Parts_1.Fuel, 8],
        [Parts_1.Propulsion, 8],
        [Parts_1.Habitation, 4],
        [Parts_1.LifeSupport, 4],
        [Parts_1.Power, 4],
    ].map(([PartType, maximumNumber]) => new Validate_1.default(new Criterion_1.default((part) => part instanceof PartType), new Effect_1.default((part, spaceship) => spaceship.parts().filter((part) => part instanceof PartType)
        .length < maximumNumber))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=validate.js.map