import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default async function Profile() {
    const { cookies } = await import('next/headers');
    const cookieManager = await cookies();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
        headers: { Cookie: cookieManager.toString() },
    });
    const user = await response.json();

    return (
        <Card className="w-full max-w-xl mx-auto">
            <CardHeader>
                <CardTitle>Here you are:</CardTitle>
            </CardHeader>
            <CardContent>
                {user
                    && (
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label>
                                    <span>User ID:</span>
                                    {user?.id}
                                </Label>
                                <Label>
                                    <span>Email:</span>
                                    {user?.email}
                                </Label>
                            </div>
                        </div>
                    )}
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
                <Button variant="outline" asChild>
                    <Link href="/">To main page</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
