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
import { useUsers } from './users.hook';

export default function UsersPage() {
    const { users, isLoading } = useUsers();

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
                    : <div className="text-2xl">{isLoading ? 'Loading...' : 'Error'}</div>}
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
                <Button variant="outline" asChild>
                    <Link href="/">To main page</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
