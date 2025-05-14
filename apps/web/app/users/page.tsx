'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function UsersPage() {
    const [users, setUsers] = useState<{ id: number; email: string }[] | null>(null);

    useEffect(() => {
        async function fetchPosts() {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        }
        fetchPosts();
    }, []);

    return (
        <Card className="w-full max-w-xl mx-auto">
            <CardHeader>
                <CardTitle>Users list:</CardTitle>
            </CardHeader>
            <CardContent>
                {users
                    ? (
                            <ul>
                                {users.map(user => (
                                    <li key={user.id}>
                                        {user.id}
                                        {' - '}
                                        {user.email}
                                    </li>
                                ))}
                            </ul>
                        )
                    : <div className="text-2xl">Loading...</div>}
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
                <Button variant="outline" asChild>
                    <Link href="/">To main page</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
