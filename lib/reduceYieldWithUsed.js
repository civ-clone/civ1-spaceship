"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceYieldWithUsed = void 0;
const reduceYieldWithUsed = (yields, YieldType) => yields.reduce(([provided, required], yieldValue) => {
    if (yieldValue instanceof YieldType && yieldValue.value() > 0) {
        provided += yieldValue.value();
    }
    if (yieldValue instanceof YieldType && yieldValue.value() < 0) {
        required += Math.abs(yieldValue.value());
    }
    return [provided, required];
}, [0, 0]);
exports.reduceYieldWithUsed = reduceYieldWithUsed;
exports.default = exports.reduceYieldWithUsed;
//# sourceMappingURL=reduceYieldWithUsed.js.map