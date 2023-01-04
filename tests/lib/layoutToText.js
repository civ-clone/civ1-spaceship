"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.layoutToText = void 0;
const lookup = {
    Fuel: '0',
    Habitation: '&',
    LifeSupport: '@',
    Power: '#',
    Propulsion: '=',
    Structural: '+',
};
const layoutToText = (layout) => {
    var _a, _b, _c, _d;
    let textLayout = '';
    for (let y = 0; y < layout.height(); y++) {
        for (let x = 0; x < layout.width(); x++) {
            textLayout +=
                (_d = lookup[(_c = (_b = (_a = layout.get(x, y)) === null || _a === void 0 ? void 0 : _a.part()) === null || _b === void 0 ? void 0 : _b.constructor.name) !== null && _c !== void 0 ? _c : '']) !== null && _d !== void 0 ? _d : ' ';
        }
        textLayout += '\n';
    }
    return textLayout;
};
exports.layoutToText = layoutToText;
exports.default = exports.layoutToText;
//# sourceMappingURL=layoutToText.js.map