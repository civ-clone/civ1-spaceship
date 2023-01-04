import Layout from '@civ-clone/core-spaceship/Layout';

const lookup: { [key: string]: string } = {
  Fuel: '0',
  Habitation: '&',
  LifeSupport: '@',
  Power: '#',
  Propulsion: '=',
  Structural: '+',
};

export const layoutToText = (layout: Layout): string => {
  let textLayout = '';

  for (let y = 0; y < layout.height(); y++) {
    for (let x = 0; x < layout.width(); x++) {
      textLayout +=
        lookup[layout.get(x, y)?.part()?.constructor.name ?? ''] ?? ' ';
    }

    textLayout += '\n';
  }

  return textLayout;
};

export default layoutToText;
