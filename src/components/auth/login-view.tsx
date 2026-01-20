'use client';

import { Button } from '@/components/ui/button';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" {...props}>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.223 0-9.65-3.668-11.305-8.695l-6.573 4.818C9.656 39.663 16.318 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l6.19 5.238C42.018 35.258 44 30.035 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

export default function LoginView() {
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google: ', error);
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'Failed to sign in with Google. Please try again.',
      });
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-8">
      <div className="text-center">
        <h1 className="font-headline text-5xl font-bold text-zinc-100">
          Ethereal Notes
        </h1>
        <p className="mt-2 text-lg text-zinc-400">
          A premium, animated 3D minimal notes application.
        </p>
      </div>
      <Button
        onClick={handleGoogleSignIn}
        size="lg"
        className="bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
      >
        <GoogleIcon className="mr-2 h-6 w-6" />
        Sign in with Google
      </Button>
    </div>
  );
}
