"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Parts_1 = require("../../Parts");
const Active_1 = require("@civ-clone/core-spaceship/Rules/Active");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const propulsion = new Active_1.default(new Criterion_1.default((slot) => slot.part() instanceof Parts_1.Propulsion), new Effect_1.default((slot, layout) => {
    propulsion.disable();
    const activeSlots = layout.activeSlots();
    propulsion.enable();
    return layout
        .getAdjacent(slot)
        .some((adjacentSlot) => adjacentSlot.part() instanceof Parts_1.Fuel &&
        activeSlots.includes(adjacentSlot));
}));
const getRules = () => [
    new Active_1.default(new Effect_1.default((slot) => slot.part() !== null)),
    new Active_1.default(new Criterion_1.default((slot) => [Parts_1.Fuel, Parts_1.Habitation, Parts_1.LifeSupport, Parts_1.Power].some((PartType) => slot.part() instanceof PartType)), new Effect_1.default((slot, layout) => layout
        .getAdjacent(slot)
        .some((adjacentSlot) => adjacentSlot.part() instanceof Parts_1.Structural))),
    propulsion,
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=active.js.map