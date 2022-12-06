import ChooseSlot from '@civ-clone/core-spaceship/Rules/ChooseSlot';
import Effect from '@civ-clone/core-rule/Effect';
import Part from '@civ-clone/core-spaceship/Part';
import Layout from '@civ-clone/core-spaceship/Layout';
import Criterion from '@civ-clone/core-rule/Criterion';
import Slot from '@civ-clone/core-spaceship/Slot';

export const getRules = (): ChooseSlot[] => [
  new ChooseSlot(
    new Criterion(
      (part: Part, layout: Layout) =>
        layout
          .slots()
          .filter((slot: Slot) => slot.accepts(part) && slot.empty()).length > 0
    ),
    new Effect((part: Part, layout: Layout) => {
      const availableSlots = layout
          .slots()
          .filter((slot: Slot) => slot.accepts(part) && slot.empty())!,
        [slot] = availableSlots.sort(
          (a, b) =>
            layout.getAdjacent(b).filter((slot: Slot) => !slot.empty()).length -
              layout.getAdjacent(a).filter((slot: Slot) => !slot.empty())
                .length ||
            Math.abs(a.x() - 8) - Math.abs(b.x() - 8) ||
            Math.abs(a.y() - 6) - Math.abs(b.y() - 6)
        );

      return slot;
    })
  ),
];

export default getRules;
