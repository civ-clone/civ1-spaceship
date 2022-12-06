import { Build, IBuildCriterion } from '@civ-clone/core-city-build/Rules/Build';
import {
  Fuel,
  Habitation,
  LifeSupport,
  Power,
  Propulsion,
  Structural,
} from '../../Parts';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  SpaceshipRegistry,
  instance as spaceshipRegistryInstance,
} from '@civ-clone/core-spaceship/SpaceshipRegistry';
import {
  WonderRegistry,
  instance as wonderRegistryInstance,
} from '@civ-clone/core-wonder/WonderRegistry';
import Advance from '@civ-clone/core-science/Advance';
import ApolloProgram from '@civ-clone/base-wonder-apolloprogram/ApolloProgram';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { IConstructor } from '@civ-clone/core-registry/Registry';
import Part from '@civ-clone/core-spaceship/Part';
import Plastics from '@civ-clone/base-science-advance-plastics/Plastics';
import Robotics from '@civ-clone/base-science-advance-robotics/Robotics';
import SpaceFlight from '@civ-clone/base-science-advance-spaceflight/SpaceFlight';

export const getRules = (
  wonderRegistry: WonderRegistry = wonderRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  spaceshipRegistry: SpaceshipRegistry = spaceshipRegistryInstance
): Build[] => [
  new Build(
    new Criterion((city: City, BuildItem: IConstructor): boolean =>
      Object.prototype.isPrototypeOf.call(Part, BuildItem)
    ),
    new Effect(
      () =>
        new Criterion(() =>
          wonderRegistry.some((wonder) => wonder instanceof ApolloProgram)
        )
    )
  ),

  new Build(
    new Criterion((city: City, BuildItem: IConstructor): boolean =>
      Object.prototype.isPrototypeOf.call(Part, BuildItem)
    ),
    new Effect(
      (city: City) =>
        new Criterion(
          () => spaceshipRegistry.getActiveByPlayer(city.player()) !== null
        )
    )
  ),

  ...(
    [
      [Structural, SpaceFlight],
      [Fuel, Plastics],
      [Propulsion, Plastics],
      [Habitation, Robotics],
      [LifeSupport, Robotics],
      [Power, Robotics],
    ] as [typeof Part, typeof Advance][]
  ).map(
    ([PartType, RequiredAdvance]): Build =>
      new Build(
        new Criterion(
          (city: City, BuildItem: IConstructor): boolean =>
            BuildItem === PartType
        ),
        new Effect(
          (city: City): IBuildCriterion =>
            new Criterion((): boolean =>
              playerResearchRegistry
                .getByPlayer(city.player())
                .completed(RequiredAdvance)
            )
        )
      )
  ),
];

export default getRules;
