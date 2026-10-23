"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.deriveBuildRules = exports.buildRulesFor = exports.notLaunchedRule = void 0;
const Build_1 = require("@civ-clone/core-city-build/Rules/Build");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const Requirement_1 = require("@civ-clone/core-requirement/Requirement");
const SpaceshipRegistry_1 = require("@civ-clone/core-spaceship/SpaceshipRegistry");
const WonderRegistry_1 = require("@civ-clone/core-wonder/WonderRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Part_1 = require("@civ-clone/core-spaceship/Part");
const Wonder_1 = require("@civ-clone/core-wonder/Wonder");
const Requirements_1 = require("../../Requirements");
/** Parts are only built for a spaceship that hasn't launched: a state of the game, so a rule written by hand. */
const notLaunchedRule = (spaceshipRegistry = SpaceshipRegistry_1.instance) => new Build_1.Build('civ1-spaceship:city/build/not-launched', Part_1.default, new Criterion_1.default((city, BuildItem) => Object.prototype.isPrototypeOf.call(Part_1.default, BuildItem)), new Effect_1.default((city) => new Criterion_1.default(() => {
    const spaceship = spaceshipRegistry.getActiveByPlayer(city.player());
    if (spaceship === null) {
        return false;
    }
    return spaceship.launched() === false;
})));
exports.notLaunchedRule = notLaunchedRule;
/**
 * The rule `entry` is played by: a city may build its subject only while its targets are met. A Wonder is met once
 * anyone in the world has built it, and an advance once the city's player has discovered it. An entry about `Part`
 * itself, which is never built, is about every part.
 */
const buildRulesFor = (entry, wonderRegistry = WonderRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance) => {
    if (entry.relation !== 'requires') {
        return [];
    }
    return [
        new Build_1.Build(entry.id, entry.subject, new Criterion_1.default((city, BuildItem) => entry.subject === Part_1.default
            ? Object.prototype.isPrototypeOf.call(Part_1.default, BuildItem)
            : BuildItem === entry.subject), new Effect_1.default((city) => new Criterion_1.default(() => (0, Requirement_1.met)(entry, (target) => Object.prototype.isPrototypeOf.call(Wonder_1.default, target)
            ? wonderRegistry.some((wonder) => wonder instanceof target)
            : playerResearchRegistry
                .getByPlayer(city.player())
                .completed(target))))),
    ];
};
exports.buildRulesFor = buildRulesFor;
/** What `registerRules` gives the game's `requirements` to make each entry's rules with. */
const deriveBuildRules = (wonderRegistry, playerResearchRegistry) => (entry) => (0, exports.buildRulesFor)(entry, wonderRegistry, playerResearchRegistry);
exports.deriveBuildRules = deriveBuildRules;
/**
 * Every rule about which parts a city may build, as `registerRules` registers them: the Apollo Program's, the
 * unlaunched spaceship's, then one for each part's advance. For a rule registry without a game's `requirements`
 * (tests, and rulesets that build on these): a game's are registered through `game.requirements`, so a plugin can
 * change an entry and its rule together.
 */
const getRules = (wonderRegistry = WonderRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance, spaceshipRegistry = SpaceshipRegistry_1.instance) => [
    ...Requirements_1.requiresWonder.flatMap((entry) => (0, exports.buildRulesFor)(entry, wonderRegistry, playerResearchRegistry)),
    (0, exports.notLaunchedRule)(spaceshipRegistry),
    ...Requirements_1.requiresAdvance.flatMap((entry) => (0, exports.buildRulesFor)(entry, wonderRegistry, playerResearchRegistry)),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=build.js.map