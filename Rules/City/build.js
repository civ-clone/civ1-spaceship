"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Build_1 = require("@civ-clone/core-city-build/Rules/Build");
const Parts_1 = require("../../Parts");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const SpaceshipRegistry_1 = require("@civ-clone/core-spaceship/SpaceshipRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const ApolloProgram_1 = require("@civ-clone/base-wonder-apolloprogram/ApolloProgram");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Part_1 = require("@civ-clone/core-spaceship/Part");
const Plastics_1 = require("@civ-clone/base-science-advance-plastics/Plastics");
const Robotics_1 = require("@civ-clone/base-science-advance-robotics/Robotics");
const SpaceFlight_1 = require("@civ-clone/base-science-advance-spaceflight/SpaceFlight");
const getRules = (wonderRegistry = WonderRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance, spaceshipRegistry = SpaceshipRegistry_1.instance) => [
    new Build_1.Build(new Criterion_1.default((city, BuildItem) => Object.prototype.isPrototypeOf.call(Part_1.default, BuildItem)), new Effect_1.default(() => new Criterion_1.default(() => wonderRegistry.some((wonder) => wonder instanceof ApolloProgram_1.default)))),
    new Build_1.Build(new Criterion_1.default((city, BuildItem) => Object.prototype.isPrototypeOf.call(Part_1.default, BuildItem)), new Effect_1.default((city) => new Criterion_1.default(() => spaceshipRegistry.getActiveByPlayer(city.player()) !== null))),
    ...[
        [Parts_1.Structural, SpaceFlight_1.default],
        [Parts_1.Fuel, Plastics_1.default],
        [Parts_1.Propulsion, Plastics_1.default],
        [Parts_1.Habitation, Robotics_1.default],
        [Parts_1.LifeSupport, Robotics_1.default],
        [Parts_1.Power, Robotics_1.default],
    ].map(([PartType, RequiredAdvance]) => new Build_1.Build(new Criterion_1.default((city, BuildItem) => BuildItem === PartType), new Effect_1.default((city) => new Criterion_1.default(() => playerResearchRegistry
        .getByPlayer(city.player())
        .completed(RequiredAdvance))))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=build.js.map