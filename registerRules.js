"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const build_1 = require("./Rules/City/build");
const build_cost_1 = require("./Rules/City/build-cost");
const building_complete_1 = require("./Rules/City/building-complete");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const built_1 = require("./Rules/Spaceship/built");
const chance_of_success_1 = require("./Rules/Spaceship/chance-of-success");
const choose_slot_1 = require("./Rules/Spaceship/choose-slot");
const flight_time_1 = require("./Rules/Spaceship/flight-time");
const lost_1 = require("./Rules/Spaceship/lost");
const yield_1 = require("./Rules/Spaceship/yield");
const validate_1 = require("./Rules/Spaceship/validate");
RuleRegistry_1.instance.register(...(0, build_1.default)(), ...(0, build_cost_1.default)(), ...(0, building_complete_1.default)(), ...(0, built_1.default)(), ...(0, chance_of_success_1.default)(), ...(0, choose_slot_1.default)(), ...(0, flight_time_1.default)(), ...(0, lost_1.default)(), ...(0, validate_1.default)(), ...(0, yield_1.default)());
//# sourceMappingURL=registerRules.js.map