import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import Effect from '@civ-clone/core-rule/Effect';
import Spaceship from '@civ-clone/core-spaceship/Spaceship';
import Landed from '@civ-clone/core-spaceship/Rules/Landed';

export const getRules = (engine: Engine = engineInstance): Landed[] => [
  new Landed(
    new Effect((spaceship: Spaceship) => {
      engine.emit('player:spaceship:landed', spaceship.player());
    })
  ),
];

export default getRules;
