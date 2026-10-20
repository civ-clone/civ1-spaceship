"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelSpaceship = void 0;
// The player's spaceship goes back to Earth if it has launched, or its construction is cancelled if it hasn't. A ship
//  with no parts yet has nothing to lose.
const cancelSpaceship = (player, spaceshipRegistry) => {
    const spaceship = spaceshipRegistry.getActiveByPlayer(player);
    if (spaceship === null ||
        (spaceship.launched() === false &&
            spaceship.activeParts().length + spaceship.inactiveParts().length === 0)) {
        return;
    }
    spaceship.lose();
};
exports.cancelSpaceship = cancelSpaceship;
exports.default = exports.cancelSpaceship;
//# sourceMappingURL=cancelSpaceship.js.map