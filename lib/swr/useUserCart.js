import useSWR from 'swr';
import fetcher from './fetcher';
export default function useUserCart(userCart, userStore) {
  if (userCart.etag && userCart.location) {
    const { location, etag } = userCart;
    const { data, error } = useSWR(`/api/cart/${userStore.id}/${location}?etag=${encodeURIComponent(etag)}`, fetcher);
    return {
      data,
      isLoading: !error && !data,
      isError: error
    };
  } else {
    return {
      data: null,
      isError: false,
      isLoading: false
    };
  }
}
