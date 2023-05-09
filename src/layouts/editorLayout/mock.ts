import { faker } from '@faker-js/faker';
interface Item {
  id: number | string;
  type: string;
  children?: Item[];
  // permission: 0 | 1;
}
const mediaTypes = ['Video', 'Image', 'Audio'];
function generateItem(): Item {
  return {
    id: faker.datatype.uuid(),
    type: faker.helpers.shuffle(mediaTypes)[0]
    // children: [{}]
  };
}
function generateList(): Item[] {
  return mediaTypes.map(() => generateItem());
}
export function getMaterialAuthList(): Promise<Item[]> {
  return new Promise(resolve => {
    resolve(generateList());
  });
}
