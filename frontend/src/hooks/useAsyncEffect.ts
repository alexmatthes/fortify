import { useEffect, useState } from 'react';

interface UseAsyncEffectState<T> {
	data: T | null;
	loading: boolean;
	error: Error | null;
}

export function useAsyncEffect<T>(asyncFunction: () => Promise<T>, ...dependencies: readonly unknown[]): UseAsyncEffectState<T> {
	const [state, setState] = useState<UseAsyncEffectState<T>>({
		data: null,
		loading: true,
		error: null,
	});

	useEffect(() => {
		let isMounted = true;

		const fetchData = async () => {
			setState((prev) => ({ ...prev, loading: true, error: null }));
			try {
				const data = await asyncFunction();
				if (isMounted) {
					setState({ data, loading: false, error: null });
				}
			} catch (error) {
				if (isMounted) {
					setState({
						data: null,
						loading: false,
						error: error instanceof Error ? error : new Error('An unknown error occurred'),
					});
				}
			}
		};

		fetchData();

		return () => {
			isMounted = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, dependencies);

	return state;
}
