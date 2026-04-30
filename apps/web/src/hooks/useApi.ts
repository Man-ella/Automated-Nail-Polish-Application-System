import { useEffect, useState } from "react";

/**
 * Minimal data-fetching hook. Resolves a value from the API client and
 * exposes loading/error state so pages can render skeletons/fallbacks
 * without pulling in a heavier client. Swap for TanStack Query when the
 * backend is wired up if cache invalidation or polling is needed.
 */
export function useApi<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    loader()
      .then((v) => {
        if (alive) setData(v);
      })
      .catch((e: unknown) => {
        if (alive) setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
