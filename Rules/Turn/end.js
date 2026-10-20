"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const PlayerRegistry_1 = require("@civ-clone/core-player/PlayerRegistry");
const SpaceshipRegistry_1 = require("@civ-clone/core-spaceship/SpaceshipRegistry");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const End_1 = require("@civ-clone/core-turn-based-game/Rules/End");
const High_1 = require("@civ-clone/core-rule/Priorities/High");
const getRules = (spaceshipRegistry = SpaceshipRegistry_1.instance, playerRegistry = PlayerRegistry_1.instance) => [
    // Once every player has moved, the first ship whose arrival turn has come lands (v474.05 `GameEngine.cs` L364-375).
    //  In player order, so the first player's ship wins a tie, and one landing is the turn's arrival: any other ship due
    //  lands on a later turn. `High`, so a landing comes before any other ending checked at the end of the same turn,
    //  as v474.05 checks the spaceship first.
    new End_1.default('civ1-spaceship:turn/end/arrival', new High_1.default(), new Effect_1.default(() => {
        playerRegistry.entries().some((player) => {
            const spaceship = spaceshipRegistry.getActiveByPlayer(player);
            if (spaceship === null) {
                return false;
            }
            spaceship.check();
            return spaceship.successful() === true;
        });
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=end.js.map