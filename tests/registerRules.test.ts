import BuildingComplete from '@civ-clone/core-city-build/Rules/BulidingComplete';
import Spend from '@civ-clone/core-treasury/Rules/Spend';
import { defaultGame } from '@civ-clone/core-game';
import { expect } from 'chai';
import '../registerRules';

describe('registerRules', () => {
  // civ1-treasury prices a part along with every other buy price: a `Spend` rule here as well gave a city building a
  //  part a second, identical, price (civ-clone/web-renderer#713).
  it('should register no `Spend` rules', () => {
    expect(defaultGame.rules.get(BuildingComplete)).to.not.be.empty;
    expect(defaultGame.rules.get(Spend)).to.be.empty;
  });
});
