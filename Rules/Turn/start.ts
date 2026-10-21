import {
  LayoutRegistry,
  instance as layoutRegistryInstance,
} from '@civ-clone/core-spaceship/LayoutRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  SpaceshipRegistry,
  instance as spaceshipRegistryInstance,
} from '@civ-clone/core-spaceship/SpaceshipRegistry';
import {
  Turn,
  instance as turnInstance,
} from '@civ-clone/core-turn-based-game/Turn';
import { Year, instance as yearInstance } from '@civ-clone/core-game-year/Year';
import ChooseSlot from '@civ-clone/core-spaceship/Rules/ChooseSlot';
import Default from '@civ-clone/civ1-default-spaceship-layout/Default';
import Effect from '@civ-clone/core-rule/Effect';
import Layout from '@civ-clone/core-spaceship/Layout';
import Part from '@civ-clone/core-spaceship/Part';
import Slot from '@civ-clone/core-spaceship/Slot';
import Spaceship from '@civ-clone/core-spaceship/Spaceship';
import Start from '@civ-clone/core-turn-based-game/Rules/Start';

export const getRules = (
  spaceshipRegistry: SpaceshipRegistry = spaceshipRegistryInstance,
  layoutRegistry: LayoutRegistry = layoutRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  turn: Turn = turnInstance,
  year: Year = yearInstance
): Start[] => [
  // Before 0.1.3 the Apollo Program gave every player's ship the same layout, so each player's parts went into all of
  //  them. A game saved then shares it still: each ship still being built gets a layout of its own, with the parts
  //  its player's cities built. A ship in flight keeps what it launched with.
  new Start(
    'civ1-spaceship:turn/start/own-layouts',
    new Effect((): void => {
      const building = spaceshipRegistry
          .entries()
          .filter(
            (spaceship: Spaceship): boolean =>
              spaceship.successful() === null && spaceship.launched() === false
          ),
        shared = building.filter((spaceship: Spaceship): boolean =>
          building.some(
            (other: Spaceship): boolean =>
              other !== spaceship && other.layout() === spaceship.layout()
          )
        );

      shared.forEach((spaceship: Spaceship): void => {
        const [LayoutType] = layoutRegistry.entries() as (typeof Default)[],
          replacement = new Spaceship(
            spaceship.player(),
            new LayoutType(ruleRegistry),
            ruleRegistry,
            turn,
            year
          );

        spaceship
          .layout()
          .slots()
          .map((slot: Slot): Part | null => slot.part())
          .filter(
            (part: Part | null): part is Part =>
              part !== null && part.city().player() === spaceship.player()
          )
          .forEach((part: Part): void => {
            const [slot] = ruleRegistry.process(
              ChooseSlot,
              part,
              replacement.layout() as Layout
            );

            slot?.fill(part);
          });

        spaceshipRegistry.unregister(spaceship);
        spaceshipRegistry.register(replacement);
      });
    })
  ),
];

export default getRules;
