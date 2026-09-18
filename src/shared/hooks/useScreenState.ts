import { useMemo } from 'react';

type ScreenStateInput<T> = {
  data?: T;
  isLoading?: boolean;
  error?: unknown;
};

export function useScreenState<T>({
  data,
  error,
  isLoading,
}: ScreenStateInput<T>) {
  return useMemo(
    () => ({
      data,
      errorMessage:
        error instanceof Error
          ? error.message
          : error
            ? 'Unable to load data'
            : null,
      isEmpty: Array.isArray(data) ? data.length === 0 : !data,
      isLoading: Boolean(isLoading),
    }),
    [data, error, isLoading],
  );
}
