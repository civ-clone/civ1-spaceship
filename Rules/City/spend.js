"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Gold_1 = require("@civ-clone/base-city-yield-gold/Gold");
const Part_1 = require("@civ-clone/core-spaceship/Part");
const Spend_1 = require("@civ-clone/core-treasury/Rules/Spend");
const SpendCost_1 = require("@civ-clone/core-treasury/SpendCost");
const getRules = () => [
    new Spend_1.default(new Criterion_1.default((cityBuild) => cityBuild.building() !== null &&
        Object.isPrototypeOf.call(Part_1.default, cityBuild.building().item())), new Criterion_1.default((cityBuild) => cityBuild.progress().value() === 0), new Effect_1.default((cityBuild) => new SpendCost_1.default(Gold_1.default, cityBuild.remaining() * 8))),
    new Spend_1.default(new Criterion_1.default((cityBuild) => cityBuild.building() !== null &&
        Object.isPrototypeOf.call(Part_1.default, cityBuild.building().item())), new Criterion_1.default((cityBuild) => cityBuild.progress().value() > 0), new Effect_1.default((cityBuild) => new SpendCost_1.default(Gold_1.default, cityBuild.remaining() * 4))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=spend.js.map