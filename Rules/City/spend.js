"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Part_1 = require("@civ-clone/core-spaceship/Part");
const Spend_1 = require("@civ-clone/core-treasury/Rules/Spend");
const getRules = () => [
    new Spend_1.default(new Criterion_1.default((cityBuild) => typeof cityBuild.building() !== 'undefined' &&
        Object.isPrototypeOf.call(Part_1.default, cityBuild.building().item())), new Criterion_1.default((cityBuild) => cityBuild.progress().value() === 0), new Effect_1.default((cityBuild, cost) => {
        cost.add(cityBuild.remaining() * 8);
        return cost;
    })),
    new Spend_1.default(new Criterion_1.default((cityBuild) => typeof cityBuild.building() !== 'undefined' &&
        Object.isPrototypeOf.call(Part_1.default, cityBuild.building().item())), new Criterion_1.default((cityBuild) => cityBuild.progress().value() > 0), new Effect_1.default((cityBuild, cost) => {
        cost.add(cityBuild.remaining() * 4);
        return cost;
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=spend.js.map