import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Custom hook for auto-refreshing data
 * @param {Function} fetchFunction - The async function to call for fetching data
 * @param {number} interval - Interval in milliseconds (default: 5000ms = 5s for comments)
 * @param {Array} dependencies - Dependencies array to trigger refresh
 * @param {boolean} enabled - Whether auto-refresh is enabled (default: true)
 */
export const useAutoRefresh = (
  fetchFunction,
  interval = 5000,
  dependencies = [],
  enabled = true
) => {
  const intervalIdRef = useRef(null);
  const isActiveRef = useRef(true);

  const startAutoRefresh = useCallback(() => {
    if (!enabled || !isActiveRef.current) return;

    // Initial fetch
    fetchFunction();

    // Set up interval for subsequent fetches
    intervalIdRef.current = setInterval(() => {
      if (isActiveRef.current) {
        fetchFunction();
      }
    }, interval);
  }, [fetchFunction, interval, enabled]);

  const stopAutoRefresh = useCallback(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  }, []);

  // Start auto-refresh when component mounts or dependencies change
  useEffect(() => {
    isActiveRef.current = true;
    startAutoRefresh();

    return () => {
      isActiveRef.current = false;
      stopAutoRefresh();
    };
  }, [startAutoRefresh, stopAutoRefresh, ...dependencies]);

  // Stop auto-refresh when component unmounts
  useEffect(() => {
    return () => {
      isActiveRef.current = false;
      stopAutoRefresh();
    };
  }, [stopAutoRefresh]);

  return {
    startAutoRefresh,
    stopAutoRefresh,
    isActive: isActiveRef.current
  };
};

/**
 * Custom hook for handling optimistic updates
 * Useful for comments and reactions that should appear immediately
 */
export const useOptimisticUpdate = (initialData) => {
  const [data, setData] = useState(initialData);
  const originalDataRef = useRef(initialData);

  const updateOptimistically = useCallback((updater) => {
    originalDataRef.current = data;
    setData(prevData => updater(prevData));
  }, [data]);

  const rollback = useCallback(() => {
    setData(originalDataRef.current);
  }, []);

  const confirm = useCallback(() => {
    originalDataRef.current = data;
  }, [data]);

  return {
    data,
    updateOptimistically,
    rollback,
    confirm
  };
};
