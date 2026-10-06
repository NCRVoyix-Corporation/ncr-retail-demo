import useSWR from 'swr';
import fetcher from './fetcher';
export default function useCart(storeId, cartId) {
  // Don't call this if Cart ID is/becomes null
  let url = `/api/cart/${storeId}/${cartId}`;
  let { data, error } = useSWR(url, fetcher);
  return {
    data,
    isLoading: !error && !data,
    isError: error
  };
}
