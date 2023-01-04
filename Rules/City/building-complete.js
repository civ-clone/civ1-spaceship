"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CurrentPlayerRegistry_1 = require("@civ-clone/core-player/CurrentPlayerRegistry");
const LayoutRegistry_1 = require("@civ-clone/core-spaceship/LayoutRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const SpaceshipRegistry_1 = require("@civ-clone/core-spaceship/SpaceshipRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const ApolloProgram_1 = require("@civ-clone/base-wonder-apolloprogram/ApolloProgram");
const BulidingComplete_1 = require("@civ-clone/core-city-build/Rules/BulidingComplete");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Part_1 = require("@civ-clone/core-spaceship/Part");
const Spaceship_1 = require("@civ-clone/core-spaceship/Spaceship");
const getRules = (currentPlayerRegistry = CurrentPlayerRegistry_1.instance, spaceshipRegistry = SpaceshipRegistry_1.instance, layoutRegistry = LayoutRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, turn = Turn_1.instance, randomNumberGenerator = () => Math.random()) => [
    new BulidingComplete_1.default(new Criterion_1.default((cityBuild, buildItem) => buildItem instanceof ApolloProgram_1.default), new Effect_1.default(() => {
        // TODO: if there is more than one layout, ask the player to choose.
        const [LayoutType] = layoutRegistry.entries(), layout = new LayoutType(ruleRegistry);
        currentPlayerRegistry
            .entries()
            .forEach((player) => spaceshipRegistry.register(new Spaceship_1.default(player, layout, ruleRegistry, turn, randomNumberGenerator)));
    })),
    new BulidingComplete_1.default(new Criterion_1.default((cityBuild, buildItem) => buildItem instanceof Part_1.default), new Criterion_1.default((cityBuild, buildItem) => spaceshipRegistry.getActiveByPlayer(buildItem.city().player()) !== null), new Effect_1.default((cityBuild, buildItem) => {
        const part = buildItem;
        spaceshipRegistry.getActiveByPlayer(part.city().player()).add(part);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=building-complete.js.map