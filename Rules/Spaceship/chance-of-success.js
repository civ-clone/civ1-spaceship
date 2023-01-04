"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Yields_1 = require("../../Yields");
const Parts_1 = require("../../Parts");
const ChanceOfSuccess_1 = require("@civ-clone/core-spaceship/Rules/ChanceOfSuccess");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const getRules = () => [
    new ChanceOfSuccess_1.default(new Effect_1.default((spaceship) => {
        const [totalEnergy, requiredEnergy, totalLifeSupport, requiredLifeSupport, population,] = spaceship.yields().reduce(([totalEnergy, requiredEnergy, totalLifeSupport, requiredLifeSupport, population,], shipYield) => {
            if (shipYield instanceof Yields_1.Energy && shipYield.value() > 0) {
                totalEnergy += shipYield.value();
            }
            if (shipYield instanceof Yields_1.Energy && shipYield.value() < 0) {
                requiredEnergy += Math.abs(shipYield.value());
            }
            if (shipYield instanceof Yields_1.LifeSupport && shipYield.value() > 0) {
                totalLifeSupport += shipYield.value();
            }
            if (shipYield instanceof Yields_1.LifeSupport && shipYield.value() < 0) {
                requiredLifeSupport += Math.abs(shipYield.value());
            }
            if (shipYield instanceof Yields_1.Population) {
                population += shipYield.value();
            }
            return [
                totalEnergy,
                requiredEnergy,
                totalLifeSupport,
                requiredLifeSupport,
                population,
            ];
        }, [0, 0, 0, 0, 0]);
        const [totalFuel, totalPropulsion] = spaceship.activeParts().reduce(([totalFuel, totalPropulsion], part) => {
            if (part instanceof Parts_1.Fuel) {
                totalFuel++;
            }
            if (part instanceof Parts_1.Propulsion) {
                totalPropulsion++;
            }
            return [totalFuel, totalPropulsion];
        }, [0, 0]);
        if ([
            totalEnergy,
            totalLifeSupport,
            population,
            totalFuel,
            totalPropulsion,
        ].some((value) => value === 0)) {
            return 0;
        }
        const fuelToPropulsionRatio = Math.min(totalFuel / totalPropulsion, 1), lifeSupportRatio = Math.min(requiredLifeSupport / totalLifeSupport, 1), energyRatio = Math.min(requiredEnergy / totalEnergy, 1);
        return fuelToPropulsionRatio * lifeSupportRatio * energyRatio;
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=chance-of-success.js.map