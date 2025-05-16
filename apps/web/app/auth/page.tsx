'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SyntheticEvent, useState } from 'react';

export default function Auth() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const method = event.nativeEvent.submitter?.getAttribute('formaction')?.slice(1) ?? '/login';
            const formData = new FormData(event.currentTarget);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth${method}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(Object.fromEntries(formData)),
            });

            if (response.ok) {
                // Why client action can't use redirect from next/navigation?
                location.pathname = '/';
                return;
            }

            const data = await response.json();
            setError(data.message);
        }
        catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <form className="w-full max-w-xl mx-auto" method="POST" onSubmit={onSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Access denied</CardTitle>
                    <CardDescription>Please enter your credentials:</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Input name="email" placeholder="Email" disabled={isLoading} />
                            <Input name="password" type="password" placeholder="Password" disabled={isLoading} />
                            {error && <Badge className="p-2 place-self-center" variant="destructive">{error}</Badge>}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-4">
                    <Button disabled={isLoading} type="submit" formAction="?/login">Sign in</Button>
                    <Button disabled={isLoading} variant="outline" formAction="?/register" type="submit">Sign up</Button>
                </CardFooter>
            </Card>
        </form>
    );
}
