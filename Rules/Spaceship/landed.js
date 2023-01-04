"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Engine_1 = require("@civ-clone/core-engine/Engine");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Landed_1 = require("@civ-clone/core-spaceship/Rules/Landed");
const getRules = (engine = Engine_1.instance) => [
    new Landed_1.default(new Effect_1.default((spaceship) => {
        engine.emit('player:spaceship:landed', spaceship.player());
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=landed.js.map