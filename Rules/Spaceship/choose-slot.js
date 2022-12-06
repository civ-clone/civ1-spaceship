"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const ChooseSlot_1 = require("@civ-clone/core-spaceship/Rules/ChooseSlot");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const getRules = () => [
    new ChooseSlot_1.default(new Criterion_1.default((part, layout) => layout
        .slots()
        .filter((slot) => slot.accepts(part) && slot.empty()).length > 0), new Effect_1.default((part, layout) => {
        const availableSlots = layout
            .slots()
            .filter((slot) => slot.accepts(part) && slot.empty()), [slot] = availableSlots.sort((a, b) => layout.getAdjacent(b).filter((slot) => !slot.empty()).length -
            layout.getAdjacent(a).filter((slot) => !slot.empty())
                .length ||
            Math.abs(a.x() - 8) - Math.abs(b.x() - 8) ||
            Math.abs(a.y() - 6) - Math.abs(b.y() - 6));
        return slot;
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=choose-slot.js.map