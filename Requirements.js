"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.describedRequirements = exports.buildRequirements = exports.notLaunched = exports.unlaunchedSpaceship = exports.requiresAdvance = exports.requiresWonder = void 0;
const Requirement_1 = require("@civ-clone/core-requirement/Requirement");
const Parts_1 = require("./Parts");
const ApolloProgram_1 = require("@civ-clone/base-wonder-apolloprogram/ApolloProgram");
const Part_1 = require("@civ-clone/core-spaceship/Part");
const Plastics_1 = require("@civ-clone/base-science-advance-plastics/Plastics");
const Robotics_1 = require("@civ-clone/base-science-advance-robotics/Robotics");
const SpaceFlight_1 = require("@civ-clone/base-science-advance-spaceflight/SpaceFlight");
// What Civilization's spaceship parts need, as the entries `Rules/City/build` makes its rules from
//  (civ-clone/web-renderer#37). `registerRules` adds them to the game's `requirements`.
/** Every part needs the Apollo Program built, by anyone: one rule, about all of them. */
exports.requiresWonder = (0, Requirement_1.table)('civ1-spaceship:city/build/requires-wonder', 'requires', [[Part_1.default, ApolloProgram_1.default]], {
    range: 'world',
});
/** The advance a city's player needs before it can build each part: one rule each. */
exports.requiresAdvance = (0, Requirement_1.table)('civ1-spaceship:city/build/requires-advance', 'requires', [
    [Parts_1.Structural, SpaceFlight_1.default],
    [Parts_1.Fuel, Plastics_1.default],
    [Parts_1.Propulsion, Plastics_1.default],
    [Parts_1.Habitation, Robotics_1.default],
    [Parts_1.LifeSupport, Robotics_1.default],
    [Parts_1.Power, Robotics_1.default],
]);
/** A player with a spaceship that hasn't launched, which `Rules/City/build`'s own rule decides. */
exports.unlaunchedSpaceship = new Requirement_1.Condition('civ1-spaceship:unlaunched-spaceship');
/**
 * Parts are only built for a spaceship that hasn't launched. The rule is written by hand; this entry names it for the
 * civilopedia.
 */
exports.notLaunched = new Requirement_1.Requirement({
    id: 'civ1-spaceship:city/build/not-launched',
    subject: Part_1.default,
    relation: 'requires',
    targets: [exports.unlaunchedSpaceship],
});
/** The entries `Rules/City/build`'s deriver makes rules from, in the order the rules were always registered. */
exports.buildRequirements = [
    ...exports.requiresWonder,
    ...exports.requiresAdvance,
];
/** The entries that only describe: no rule is made from them. */
exports.describedRequirements = [exports.notLaunched];
exports.default = exports.buildRequirements;
//# sourceMappingURL=Requirements.js.map