import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Home() {
    return (
        <Card className="w-full max-w-xl mx-auto">
            <CardHeader>
                <CardTitle>Access granted</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Button variant="outline" asChild>
                            <Link href="/profile">My profile</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/users">All users</Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
                <Button
                    variant="destructive"
                    onClick={async function () {
                        'use server';
                        (await cookies())
                            .delete('access_token')
                            .delete('refresh_token');
                        redirect('/');
                    }}
                >
                    Log out
                </Button>
            </CardFooter>
        </Card>
    );
}
