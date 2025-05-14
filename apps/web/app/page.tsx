import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

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
        </Card>
    );
}
