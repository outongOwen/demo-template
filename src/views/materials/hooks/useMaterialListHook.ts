import { getPage } from './mock';
export default function useMaterialList() {
  const total = ref<number>(20);
  const pageProvider = async (pageNumber: number, pageSize: number): Promise<unknown[]> => {
    console.log(pageNumber, pageSize);
    const pageData = await getPage(pageNumber + 1, pageSize);
    total.value = pageData.total;
    return pageData.list;
  };
  return {
    total,
    pageProvider
  };
}
