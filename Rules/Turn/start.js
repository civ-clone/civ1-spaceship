"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const LayoutRegistry_1 = require("@civ-clone/core-spaceship/LayoutRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const SpaceshipRegistry_1 = require("@civ-clone/core-spaceship/SpaceshipRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const Year_1 = require("@civ-clone/core-game-year/Year");
const ChooseSlot_1 = require("@civ-clone/core-spaceship/Rules/ChooseSlot");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Spaceship_1 = require("@civ-clone/core-spaceship/Spaceship");
const Start_1 = require("@civ-clone/core-turn-based-game/Rules/Start");
const getRules = (spaceshipRegistry = SpaceshipRegistry_1.instance, layoutRegistry = LayoutRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, turn = Turn_1.instance, year = Year_1.instance) => [
    // Before 0.1.3 the Apollo Program gave every player's ship the same layout, so each player's parts went into all of
    //  them. A game saved then shares it still: each ship still being built gets a layout of its own, with the parts
    //  its player's cities built. A ship in flight keeps what it launched with.
    new Start_1.default('civ1-spaceship:turn/start/own-layouts', new Effect_1.default(() => {
        const building = spaceshipRegistry
            .entries()
            .filter((spaceship) => spaceship.successful() === null && spaceship.launched() === false), shared = building.filter((spaceship) => building.some((other) => other !== spaceship && other.layout() === spaceship.layout()));
        shared.forEach((spaceship) => {
            const [LayoutType] = layoutRegistry.entries(), replacement = new Spaceship_1.default(spaceship.player(), new LayoutType(ruleRegistry), ruleRegistry, turn, year);
            spaceship
                .layout()
                .slots()
                .map((slot) => slot.part())
                .filter((part) => part !== null && part.city().player() === spaceship.player())
                .forEach((part) => {
                const [slot] = ruleRegistry.process(ChooseSlot_1.default, part, replacement.layout());
                slot === null || slot === void 0 ? void 0 : slot.fill(part);
            });
            spaceshipRegistry.unregister(spaceship);
            spaceshipRegistry.register(replacement);
        });
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=start.js.map