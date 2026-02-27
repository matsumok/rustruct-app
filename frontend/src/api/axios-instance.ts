import axios from "axios";
import type { AxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: "",
  timeout: 30000,
});

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = axiosInstance({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-expect-error cancel is added dynamically
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};
