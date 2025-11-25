import { useCallback, useEffect, useState } from 'react';

interface UseAsyncState<T> {
	data: T | null;
	loading: boolean;
	error: Error | null;
}

interface UseAsyncOptions {
	immediate?: boolean; // Execute immediately on mount
}

type AsyncFunction<T> = () => Promise<T>;

export function useAsync<T>(asyncFunction: AsyncFunction<T>, options: UseAsyncOptions = { immediate: false }): UseAsyncState<T> & { execute: () => Promise<void>; reset: () => void } {
	const [state, setState] = useState<UseAsyncState<T>>({
		data: null,
		loading: false,
		error: null,
	});

	const execute = useCallback(async () => {
		setState({ data: null, loading: true, error: null });
		try {
			const data = await asyncFunction();
			setState({ data, loading: false, error: null });
		} catch (error) {
			setState({
				data: null,
				loading: false,
				error: error instanceof Error ? error : new Error('An unknown error occurred'),
			});
		}
	}, [asyncFunction]);

	const reset = useCallback(() => {
		setState({ data: null, loading: false, error: null });
	}, []);

	useEffect(() => {
		if (options.immediate) {
			execute();
		}
	}, [execute, options.immediate]);

	return { ...state, execute, reset };
}
