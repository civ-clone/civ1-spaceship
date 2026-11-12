"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityBuildRegistry_1 = require("@civ-clone/core-city-build/CityBuildRegistry");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const PlayerRegistry_1 = require("@civ-clone/core-player/PlayerRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const LayoutRegistry_1 = require("@civ-clone/core-spaceship/LayoutRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const SpaceshipRegistry_1 = require("@civ-clone/core-spaceship/SpaceshipRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const Year_1 = require("@civ-clone/core-game-year/Year");
const ApolloProgram_1 = require("@civ-clone/base-wonder-apolloprogram/ApolloProgram");
const ChooseSlot_1 = require("@civ-clone/core-spaceship/Rules/ChooseSlot");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Part_1 = require("@civ-clone/core-spaceship/Part");
const Spaceship_1 = require("@civ-clone/core-spaceship/Spaceship");
const Start_1 = require("@civ-clone/core-turn-based-game/Rules/Start");
const wonderHistory_1 = require("@civ-clone/civ1-wonder/lib/wonderHistory");
const getRules = (spaceshipRegistry = SpaceshipRegistry_1.instance, layoutRegistry = LayoutRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, turn = Turn_1.instance, year = Year_1.instance, cityRegistry = CityRegistry_1.instance, cityBuildRegistry = CityBuildRegistry_1.instance, playerRegistry = PlayerRegistry_1.instance, wonderRegistry = WonderRegistry_1.instance, cityImprovementRegistry = CityImprovementRegistry_1.instance) => [
    // Before 0.1.3 the Apollo Program gave every player's ship the same layout, so each player's parts went into all of
    //  them. A game saved then shares it still: each ship still being built gets a layout of its own, with the parts
    //  its player's cities built. A ship in flight keeps what it launched with.
    new Start_1.default('civ1-spaceship:turn/start/own-layouts', new Effect_1.default(() => {
        const spaceships = spaceshipRegistry.entries(), shared = spaceships.filter((spaceship) => spaceship.successful() === null &&
            spaceship.launched() === false &&
            spaceships.some((other) => other !== spaceship && other.layout() === spaceship.layout()));
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
    // A ship can't change in flight, so its player's cities stop building parts for it (they would only be left behind),
    //  before this turn's shields go into them.
    new Start_1.default('civ1-spaceship:turn/start/stop-parts-in-flight', new Effect_1.default(() => spaceshipRegistry
        .entries()
        .filter((spaceship) => spaceship.successful() === null && spaceship.launched() !== false)
        .forEach((spaceship) => cityRegistry
        .getByPlayer(spaceship.player())
        .map((city) => cityBuildRegistry.getByCity(city))
        .filter((cityBuild) => { var _a; return ((_a = cityBuild.building()) === null || _a === void 0 ? void 0 : _a.item().prototype) instanceof Part_1.default; })
        .forEach((cityBuild) => cityBuild.revalidate())))),
    // The Apollo Program gives a ship to every player there is when it's built. One who comes into the game later (a
    //  destroyed civilization coming back, #178) gets one too, even once the Apollo Program has been lost with its city
    //  (civ-clone/web-renderer#971). v474.05 keeps no ship apart from the parts a civilization builds, and lets any
    //  civilization that hasn't launched build them once the Apollo Program has ever been built (`ECONOMY.C` 202:
    //  `if (i > 21 && (marvel_site[19] == -1 || (game_flags & (1 << civ)))) continue;`; a lost Wonder is `0x80`, not
    //  `-1`, `ECONOMY.C` 94-96). Here parts need a ship to go into, so a newcomer needs one to build them.
    new Start_1.default('civ1-spaceship:turn/start/ships-for-newcomers', new Effect_1.default(() => {
        if (!(0, wonderHistory_1.everBuilt)(ApolloProgram_1.default, wonderRegistry, cityImprovementRegistry)) {
            return;
        }
        playerRegistry
            .entries()
            .filter((player) => spaceshipRegistry.getBy('player', player).length === 0)
            .forEach((player) => {
            const [LayoutType] = layoutRegistry.entries();
            spaceshipRegistry.register(new Spaceship_1.default(player, new LayoutType(ruleRegistry), ruleRegistry, turn, year));
        });
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=start.js.map