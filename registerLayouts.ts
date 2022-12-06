import { instance as layoutRegistryInstance } from '@civ-clone/core-spaceship/LayoutRegistry';
import defaultLayout from './Layouts/default';

layoutRegistryInstance.register(...defaultLayout());
