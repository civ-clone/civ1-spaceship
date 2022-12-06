"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLayouts = void 0;
const Parts_1 = require("../Parts");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Layout_1 = require("@civ-clone/core-spaceship/Layout");
const Slot_1 = require("@civ-clone/core-spaceship/Slot");
const getLayouts = (ruleRegistry = RuleRegistry_1.instance) => [
    // . null
    // # Power
    // S Structural
    // F Fuel
    // ~ Propulsion
    // L LifeSupport
    // H Habitation
    // .........F~~
    // .##..##.SSS
    // .##..##.SF~~
    // SSSSSSSSSF~~
    // LLHHLLHHSSS
    // LLHHLLHHSF~~
    // HHLLHHLLSF~~
    // HHLLHHLLSSS
    // SSSSSSSSSF~~
    // .##..##.SF~~
    // .##..##.SSS
    // .........F~~
    new Layout_1.default(12, 12, [
        // .........F~~
        new Slot_1.default(9, 0, 1, 1, [Parts_1.Fuel]),
        new Slot_1.default(10, 0, 1, 2, [Parts_1.Propulsion]),
        // .##..##.SSS
        new Slot_1.default(1, 1, 2, 2, [Parts_1.Power]),
        new Slot_1.default(5, 1, 2, 2, [Parts_1.Power]),
        new Slot_1.default(8, 1, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(9, 1, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(10, 1, 1, 1, [Parts_1.Structural]),
        // .##..##.SF~~
        new Slot_1.default(8, 2, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(9, 2, 1, 1, [Parts_1.Fuel]),
        new Slot_1.default(10, 2, 1, 2, [Parts_1.Propulsion]),
        // SSSSSSSSSF~~
        new Slot_1.default(0, 3, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(1, 3, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(2, 3, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(3, 3, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(4, 3, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(5, 3, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(6, 3, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(7, 3, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(8, 3, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(9, 3, 1, 1, [Parts_1.Fuel]),
        new Slot_1.default(10, 3, 1, 2, [Parts_1.Propulsion]),
        // LLHHLLHHSSS
        new Slot_1.default(0, 4, 2, 2, [Parts_1.LifeSupport]),
        new Slot_1.default(2, 4, 2, 2, [Parts_1.Habitation]),
        new Slot_1.default(4, 4, 2, 2, [Parts_1.LifeSupport]),
        new Slot_1.default(6, 4, 2, 2, [Parts_1.Habitation]),
        new Slot_1.default(8, 4, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(9, 4, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(10, 4, 1, 1, [Parts_1.Structural]),
        // LLHHLLHHSF~~
        new Slot_1.default(8, 5, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(9, 5, 1, 1, [Parts_1.Fuel]),
        new Slot_1.default(10, 5, 1, 2, [Parts_1.Propulsion]),
        // HHLLHHLLSF~~
        new Slot_1.default(0, 6, 2, 2, [Parts_1.Habitation]),
        new Slot_1.default(2, 6, 2, 2, [Parts_1.LifeSupport]),
        new Slot_1.default(4, 6, 2, 2, [Parts_1.Habitation]),
        new Slot_1.default(6, 6, 2, 2, [Parts_1.LifeSupport]),
        new Slot_1.default(8, 6, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(9, 6, 1, 1, [Parts_1.Fuel]),
        new Slot_1.default(10, 6, 1, 2, [Parts_1.Propulsion]),
        // HHLLHHLLSSS
        new Slot_1.default(8, 7, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(9, 7, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(10, 7, 1, 1, [Parts_1.Structural]),
        // SSSSSSSSSF~~
        new Slot_1.default(0, 8, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(1, 8, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(2, 8, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(3, 8, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(4, 8, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(5, 8, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(6, 8, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(7, 8, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(8, 8, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(9, 8, 1, 1, [Parts_1.Fuel]),
        new Slot_1.default(10, 8, 1, 2, [Parts_1.Propulsion]),
        // .##..##.SF~~
        new Slot_1.default(1, 9, 2, 2, [Parts_1.Power]),
        new Slot_1.default(5, 9, 2, 2, [Parts_1.Power]),
        new Slot_1.default(8, 9, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(9, 9, 1, 1, [Parts_1.Fuel]),
        new Slot_1.default(10, 9, 1, 2, [Parts_1.Propulsion]),
        // .##..##.SSS
        new Slot_1.default(8, 10, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(9, 10, 1, 1, [Parts_1.Structural]),
        new Slot_1.default(10, 10, 1, 1, [Parts_1.Structural]),
        // .........F~~
        new Slot_1.default(9, 11, 1, 1, [Parts_1.Fuel]),
        new Slot_1.default(10, 11, 1, 2, [Parts_1.Propulsion]),
    ], ruleRegistry),
];
exports.getLayouts = getLayouts;
exports.default = exports.getLayouts;
//# sourceMappingURL=default.js.map