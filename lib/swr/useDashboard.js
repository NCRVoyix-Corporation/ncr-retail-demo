import useSWR from 'swr';
import fetcher from './fetcher';
export default function useHomepage({ param, storeID }) {
  if (param) {
    const { data, error } = useSWR(`/api/admin/dashboard/${param}?storeID=${storeID}`, fetcher);
    return {
      data,
      isLoading: !error && !data,
      isError: error
    };
  } else {
    const { data, error } = useSWR(`/api/admin/dashboard?storeID=${storeID}`, fetcher);
    return {
      data,
      isLoading: !error && !data,
      isError: error
    };
  }
}
