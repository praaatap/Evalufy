import { useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface UseAuthRedirectOptions {
  redirectTo?: string;
  redirectIfFound?: boolean;
  prefetch?: boolean;
}

export function useAuthRedirect(options: UseAuthRedirectOptions = {}) {
  const {
    redirectTo = '/dashboard',
    redirectIfFound = true,
    prefetch = true,
  } = options;

  const router = useRouter();
  const { data: session, status } = useSession();

  const handleRedirect = useCallback(() => {
    if (prefetch) {
      router.prefetch(redirectTo);
    }
    router.replace(redirectTo);
  }, [prefetch, redirectTo, router]);

  useEffect(() => {
    if (status === 'loading') return;

    const shouldRedirect = redirectIfFound ? !!session?.user : !session?.user;

    if (shouldRedirect) {
      handleRedirect();
    }
  }, [session, status, handleRedirect, redirectIfFound]);

  return {
    session,
    status,
    isLoading: status === 'loading',
    isAuthenticated: !!session?.user,
  };
}