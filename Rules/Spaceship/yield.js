"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Yields_1 = require("../../Yields");
const Parts_1 = require("../../Parts");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Yield_1 = require("@civ-clone/core-spaceship/Rules/Yield");
const getRules = () => [
    ...[
        [Parts_1.Fuel, Yields_1.Mass, 400],
        [Parts_1.Habitation, Yields_1.Energy, -50],
        [Parts_1.Habitation, Yields_1.LifeSupport, -100],
        [Parts_1.Habitation, Yields_1.Mass, 1600],
        [Parts_1.Habitation, Yields_1.Population, 10000],
        [Parts_1.LifeSupport, Yields_1.Energy, -50],
        [Parts_1.LifeSupport, Yields_1.LifeSupport, 100],
        [Parts_1.LifeSupport, Yields_1.Mass, 1600],
        [Parts_1.Power, Yields_1.Energy, 100],
        [Parts_1.Power, Yields_1.Mass, 400],
        [Parts_1.Propulsion, Yields_1.Mass, 400],
        // All SS Structural = 3900
        // This is weird, in the original game, the values are 200 for five of the pieces, but 100 for the others, so this
        //  should be 114.705882352941176... I'll keep at 100 for now!
        [Parts_1.Structural, Yields_1.Mass, 100],
    ].map(([PartType, YieldType, value]) => new Yield_1.default(new Criterion_1.default((part) => part instanceof PartType), new Effect_1.default((part) => new YieldType(value, part.id())))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=yield.js.map