"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Engine_1 = require("@civ-clone/core-engine/Engine");
const Built_1 = require("@civ-clone/core-spaceship/Rules/Built");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const getRules = (engine = Engine_1.instance) => [
    new Built_1.default(new Effect_1.default((part) => {
        engine.emit('player:spaceship:part-built', part.city().player());
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=built.js.map