import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import Built from '@civ-clone/core-spaceship/Rules/Built';
import Effect from '@civ-clone/core-rule/Effect';
import Part from '@civ-clone/core-spaceship/Part';

export const getRules = (engine: Engine = engineInstance): Built[] => [
  new Built(
    new Effect((part: Part) => {
      engine.emit('player:spaceship:part-built', part.city().player());
    })
  ),
];

export default getRules;
