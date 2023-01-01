import {
  Fuel,
  Habitation,
  LifeSupport,
  Power,
  Propulsion,
  Structural,
} from '../Parts';
import AdvanceRegistry from '@civ-clone/core-science/AdvanceRegistry';
import ApolloProgram from '@civ-clone/base-wonder-apolloprogram/ApolloProgram';
import AvailableCityBuildItemsRegistry from '@civ-clone/core-city-build/AvailableCityBuildItemsRegistry';
import BuildItem from '@civ-clone/core-city-build/BuildItem';
import BuildableInstance from '@civ-clone/core-city-build/Buildable';
import BuildingComplete from '@civ-clone/core-city-build/Rules/BulidingComplete';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import Criterion from '@civ-clone/core-rule/Criterion';
import CurrentPlayerRegistry from '@civ-clone/core-player/CurrentPlayerRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import Plastics from '@civ-clone/base-science-advance-plastics/Plastics';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import Production from '@civ-clone/base-terrain-yield-production/Production';
import Robotics from '@civ-clone/base-science-advance-robotics/Robotics';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import SpaceFlight from '@civ-clone/base-science-advance-spaceflight/SpaceFlight';
import Spaceship from '@civ-clone/core-spaceship/Spaceship';
import SpaceshipRegistry from '@civ-clone/core-spaceship/SpaceshipRegistry';
import Wonder from '@civ-clone/core-wonder/Wonder';
import WonderRegistry from '@civ-clone/core-wonder/WonderRegistry';
import build from '../Rules/City/build';
import buildCost from '../Rules/City/build-cost';
import buildingComplete from '../Rules/City/building-complete';
import { expect } from 'chai';
import { setUpCity } from '@civ-clone/civ1-city/tests/lib/setUpCity';
import Part from '@civ-clone/core-spaceship/Part';

const getBuildablesFromBuildItems = (buildItems: BuildItem[]) =>
  buildItems.map((buildItem) => buildItem.item());

describe('City:build', () => {
  it('should include the expected `Part`s for the expected cost with the expected prerequisites', async () => {
    const availableBuildItemsRegistry = new AvailableCityBuildItemsRegistry(),
      advanceRegistry = new AdvanceRegistry(),
      currentPlayerRegistry = new CurrentPlayerRegistry(),
      wonderRegistry = new WonderRegistry(),
      playerResearchRegistry = new PlayerResearchRegistry(),
      spaceshipRegistry = new SpaceshipRegistry(),
      ruleRegistry = new RuleRegistry(),
      city = await setUpCity({
        ruleRegistry,
      }),
      playerResearch = new PlayerResearch(
        city.player(),
        advanceRegistry,
        ruleRegistry
      );

    advanceRegistry.register(SpaceFlight, Plastics, Robotics);

    availableBuildItemsRegistry.register(
      ApolloProgram,
      Fuel,
      Habitation,
      LifeSupport,
      Power,
      Propulsion,
      Structural
    );

    currentPlayerRegistry.register(city.player());

    playerResearchRegistry.register(playerResearch);

    ruleRegistry.register(
      ...build(wonderRegistry, playerResearchRegistry, spaceshipRegistry),
      ...buildCost(),
      ...buildingComplete(
        currentPlayerRegistry,
        spaceshipRegistry,
        ruleRegistry
      ),
      new BuildingComplete(
        new Criterion(
          (cityBuild: CityBuild, buildItem: BuildableInstance) =>
            buildItem instanceof ApolloProgram
        ),
        new Effect((cityBuild: CityBuild, buildItem: BuildableInstance) =>
          wonderRegistry.register(buildItem as Wonder)
        )
      )
    );

    const cityBuild = new CityBuild(
      city,
      availableBuildItemsRegistry,
      ruleRegistry
    );

    expect(
      getBuildablesFromBuildItems(cityBuild.available())
    ).not.include.oneOf([
      Fuel,
      Habitation,
      LifeSupport,
      Power,
      Propulsion,
      Structural,
    ]);

    playerResearch.addAdvance(SpaceFlight);

    expect(
      getBuildablesFromBuildItems(cityBuild.available())
    ).not.include.oneOf([
      Fuel,
      Habitation,
      LifeSupport,
      Power,
      Propulsion,
      Structural,
    ]);

    expect(spaceshipRegistry.getActiveByPlayer(city.player())).null;

    cityBuild.build(ApolloProgram);
    cityBuild.add(new Production(cityBuild.building()!.cost().value()));
    cityBuild.check();

    expect(spaceshipRegistry.getActiveByPlayer(city.player())).instanceof(
      Spaceship
    );

    expect(getBuildablesFromBuildItems(cityBuild.available())).include(
      Structural
    );
    expect(
      getBuildablesFromBuildItems(cityBuild.available())
    ).not.include.oneOf([Fuel, Habitation, LifeSupport, Power, Propulsion]);

    playerResearch.addAdvance(Plastics);

    expect(
      getBuildablesFromBuildItems(cityBuild.available())
    ).include.all.members([Structural, Fuel, Propulsion]);
    expect(
      getBuildablesFromBuildItems(cityBuild.available())
    ).not.include.oneOf([Habitation, LifeSupport, Power]);

    playerResearch.addAdvance(Robotics);

    expect(
      getBuildablesFromBuildItems(cityBuild.available())
    ).include.all.members([
      Fuel,
      Habitation,
      LifeSupport,
      Power,
      Propulsion,
      Structural,
    ]);

    expect(
      getBuildablesFromBuildItems(cityBuild.available())
    ).include.all.members([
      Fuel,
      Habitation,
      LifeSupport,
      Power,
      Propulsion,
      Structural,
    ]);

    cityBuild.available().forEach((buildItem) => {
      if (buildItem.item() === Structural) {
        expect(buildItem.cost().value()).eq(80);
      }

      if ([Fuel, Propulsion].includes(buildItem.item() as typeof Part)) {
        expect(buildItem.cost().value()).eq(160);
      }

      if (
        [Habitation, LifeSupport, Power].includes(
          buildItem.item() as typeof Part
        )
      ) {
        expect(buildItem.cost().value()).eq(320);
      }
    });
  });
});
