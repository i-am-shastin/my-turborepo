import useSWR from 'swr';

const fetcher = (url: string | URL) => fetch(url, { credentials: 'include' }).then(r => r.json());

export function useUsers() {
    const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/users`, fetcher);

    return {
        users: data as { id: number; email: string }[] | undefined,
        isLoading,
        isError: error,
    };
}
