import {
  Fuel,
  Habitation,
  LifeSupport,
  Power,
  Propulsion,
  Structural,
} from '../../Parts';
import Active from '@civ-clone/core-spaceship/Rules/Active';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Layout from '@civ-clone/core-spaceship/Layout';
import Part from '@civ-clone/core-spaceship/Part';
import Slot from '@civ-clone/core-spaceship/Slot';

const propulsion = new Active(
  new Criterion((slot: Slot) => slot.part() instanceof Propulsion),
  new Effect((slot: Slot, layout: Layout) => {
    propulsion.disable();

    const activeSlots = layout.activeSlots();

    propulsion.enable();

    return layout
      .getAdjacent(slot)
      .some(
        (adjacentSlot: Slot) =>
          adjacentSlot.part() instanceof Fuel &&
          activeSlots.includes(adjacentSlot)
      );
  })
);

export const getRules = (): Active[] => [
  new Active(new Effect((slot: Slot) => slot.part() !== null)),

  new Active(
    new Criterion((slot: Slot) =>
      [Fuel, Habitation, LifeSupport, Power].some(
        (PartType: typeof Part) => slot.part() instanceof PartType
      )
    ),
    new Effect((slot: Slot, layout: Layout) =>
      layout
        .getAdjacent(slot)
        .some((adjacentSlot: Slot) => adjacentSlot.part() instanceof Structural)
    )
  ),

  propulsion,
];

export default getRules;
