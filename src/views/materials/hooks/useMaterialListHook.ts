import { getPage } from './mock';
export default function useMaterialList() {
  const total = ref<number>(20);
  const isFirstTimeLoading = ref<boolean>(true);
  const pageProvider = async (pageNumber: number, pageSize: number): Promise<unknown[]> => {
    const pageData = await getPage(pageNumber + 1, pageSize);
    isFirstTimeLoading.value && (isFirstTimeLoading.value = false);
    total.value = pageData.total;
    return pageData.list;
  };

  return {
    total,
    pageProvider,
    isFirstTimeLoading
  };
}
