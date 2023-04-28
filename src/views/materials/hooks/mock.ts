import { faker } from '@faker-js/faker';

interface Item {
  id: number | string;
  name: string;
  image: string;
  duration: number;
}

interface Page {
  list: Item[];
  total: number;
  pageSize: number;
  currentPage: number;
}

function generateItem(): Item {
  return {
    id: faker.datatype.uuid(),
    name: faker.name.fullName(),
    image: faker.image.nature(),
    duration: faker.datatype.number()
  };
}

function generatePage(total: number, pageSize: number, currentPage: number): Page {
  const list = new Array(pageSize).fill(0).map(() => generateItem());
  return {
    list,
    total,
    pageSize,
    currentPage
  };
}

export function getPage(currentPage: number, pageSize = 10): Promise<Page> {
  const total = 1000;
  return new Promise(resolve => {
    resolve(generatePage(total, pageSize, currentPage));
  });
}
