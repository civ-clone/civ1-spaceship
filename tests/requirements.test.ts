import { Fuel, Habitation, Propulsion, Structural } from '../Parts';
import {
  buildRequirements,
  describedRequirements,
  notLaunched,
  requiresAdvance,
  unlaunchedSpaceship,
} from '../Requirements';
import ApolloProgram from '@civ-clone/base-wonder-apolloprogram/ApolloProgram';
import Build from '@civ-clone/core-city-build/Rules/Build';
import City from '@civ-clone/core-city/City';
import Default from '@civ-clone/civ1-default-spaceship-layout/Default';
import { Game } from '@civ-clone/core-game/Game';
import Plastics from '@civ-clone/base-science-advance-plastics/Plastics';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import { Requirement } from '@civ-clone/core-requirement/Requirement';
import Robotics from '@civ-clone/base-science-advance-robotics/Robotics';
import Rule from '@civ-clone/core-rule/Rule';
import SpaceFlight from '@civ-clone/base-science-advance-spaceflight/SpaceFlight';
import Spaceship from '@civ-clone/core-spaceship/Spaceship';
import { expect } from 'chai';
import getRules from '../Rules/City/build';
import register from '../registerRules';

// Through `register(game)`, as a game gets them: the entries in `game.requirements`, and the rules made from them in
//  `game.rules` under the same ids (civ-clone/web-renderer#37).
const setUp = () => {
  const game = new Game();

  register(game);

  const player = new Player(game.rules),
    research = new PlayerResearch(player, game.advances, game.rules),
    city = { player: () => player } as unknown as City;

  game.playerResearch.register(research);

  // Whether every one of `game`'s build rules about `Item` lets `city` build it.
  const canBuild = (Item: Function): boolean =>
    game.rules
      .get(Build)
      .filter((rule: Build): boolean => rule.validate(city, Item as any))
      .every((rule: Build): boolean =>
        rule.process(city, Item as any).validate()
      );

  // The Apollo Program, built by another player: anyone's counts.
  const buildApolloProgram = (): void =>
    game.wonders.register(
      new ApolloProgram(
        { player: () => new Player(game.rules) } as unknown as City,
        game.rules
      )
    );

  // A spaceship for `city`'s player, which building the Apollo Program gives every player in a game.
  const addSpaceship = (): void =>
    game.spaceships.register(
      new Spaceship(player, new Default(game.rules), game.rules)
    );

  return { addSpaceship, buildApolloProgram, canBuild, game, research };
};

const ids = (rules: Rule[]): (string | null)[] =>
  rules.map((rule: Rule): string | null => rule.id());

describe('civ1-spaceship requirements', (): void => {
  it('should make one build rule for each entry that needs one, under its id, and none for the others', (): void => {
    const { game } = setUp();

    buildRequirements.forEach((entry: Requirement): void => {
      const rules = game.requirements.rulesFor(entry.id);

      expect(rules, entry.id).length(1);
      expect(rules[0], entry.id).instanceOf(Build);
      expect(game.rules.getById(entry.id), entry.id).equal(rules[0]);
    });

    describedRequirements.forEach((entry: Requirement): void => {
      expect(game.requirements.rulesFor(entry.id), entry.id).eql([]);
    });

    // The unlaunched spaceship's rule is still the hand-written one.
    expect(game.rules.getById(notLaunched.id)).instanceOf(Build);
  });

  it('should have an entry for every build rule it registers', (): void => {
    const { game } = setUp(),
      buildRuleIds = ids(game.rules.get(Build));

    expect(buildRuleIds.length).equal(1 + buildRequirements.length);
    buildRuleIds.forEach((id: string | null): void => {
      expect(game.requirements.getById(id as string), id as string).not.null;
    });
  });

  it('should register the rules in the order they always were', (): void => {
    const { game } = setUp(),
      registered: Rule[] = [],
      recording = new Game(),
      registerRules = recording.rules.register.bind(recording.rules);

    // Every rule in the order it is registered: the build rules were the first of all the package's rules, before the
    //  first build cost rule, and still are.
    recording.rules.register = (...rules: Rule[]): void => {
      registered.push(...rules);
      registerRules(...rules);
    };

    register(recording);

    expect(ids(registered.slice(0, 8))).eql(ids(getRules()));
    expect(registered[8]).not.instanceOf(Build);

    // The build rules' ids in the order `Rules/City/build` registered them before they were made from entries,
    //  written out rather than read from the same entries, so a reordered table fails here.
    expect(ids(game.rules.get(Build))).eql(ids(getRules()));
    expect(ids(getRules())).eql([
      'civ1-spaceship:city/build/requires-wonder/Part',
      'civ1-spaceship:city/build/not-launched',
      'civ1-spaceship:city/build/requires-advance/Structural',
      'civ1-spaceship:city/build/requires-advance/Fuel',
      'civ1-spaceship:city/build/requires-advance/Propulsion',
      'civ1-spaceship:city/build/requires-advance/Habitation',
      'civ1-spaceship:city/build/requires-advance/LifeSupport',
      'civ1-spaceship:city/build/requires-advance/Power',
    ]);
  });

  it('should read the graph both ways', (): void => {
    const { game } = setUp();

    // Every part is a `Part`, so the entries about `Part` are about it too.
    expect(
      game.requirements
        .for(Structural)
        .map((entry: Requirement): string => entry.id)
    ).eql([
      'civ1-spaceship:city/build/requires-wonder/Part',
      'civ1-spaceship:city/build/requires-advance/Structural',
      'civ1-spaceship:city/build/not-launched',
    ]);
    expect(
      game.requirements
        .leadsTo(ApolloProgram)
        .map((entry: Requirement): string => entry.id)
    ).eql(['civ1-spaceship:city/build/requires-wonder/Part']);
    expect(
      game.requirements
        .leadsTo(Plastics)
        .map((entry: Requirement): string => entry.id)
    ).eql([
      'civ1-spaceship:city/build/requires-advance/Fuel',
      'civ1-spaceship:city/build/requires-advance/Propulsion',
    ]);
    expect(
      game.requirements
        .leadsTo(unlaunchedSpaceship)
        .map((entry: Requirement): string => entry.id)
    ).eql(['civ1-spaceship:city/build/not-launched']);
  });

  it('should build as the entries say', (): void => {
    const { addSpaceship, buildApolloProgram, canBuild, research } = setUp();

    research.addAdvance(SpaceFlight);
    addSpaceship();

    expect(canBuild(Structural)).false;

    buildApolloProgram();

    expect(canBuild(Structural)).true;
    expect(canBuild(Fuel)).false;

    research.addAdvance(Plastics);

    expect(canBuild(Fuel)).true;
    expect(canBuild(Habitation)).false;

    research.addAdvance(Robotics);

    expect(canBuild(Habitation)).true;
  });

  it('should change what a city can build when a plugin changes an entry', (): void => {
    const { addSpaceship, canBuild, game, research } = setUp(),
      [requiresPlasticsAndRobotics] = requiresAdvance
        .filter((entry: Requirement): boolean => entry.subject === Propulsion)
        .map(
          (entry: Requirement): Requirement =>
            new Requirement({
              id: entry.id,
              subject: entry.subject,
              relation: entry.relation,
              targets: [Plastics, Robotics],
            })
        );

    game.requirements.replace(
      'civ1-spaceship:city/build/requires-advance/Propulsion',
      requiresPlasticsAndRobotics
    );
    game.requirements.remove('civ1-spaceship:city/build/requires-wonder/Part');

    // No Apollo Program is needed now, but a spaceship to build for still is.
    research.addAdvance(SpaceFlight);
    research.addAdvance(Plastics);

    expect(canBuild(Structural)).false;

    addSpaceship();

    expect(canBuild(Structural)).true;
    expect(canBuild(Propulsion)).false;

    research.addAdvance(Robotics);

    expect(canBuild(Propulsion)).true;
  });
});
