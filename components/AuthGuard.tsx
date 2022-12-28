import { AuthUserContext } from '@src/lib';
import { useRouter } from 'next/router';
import React, { ReactElement, useContext } from 'react';

interface AuthGuardProps {
  children: ReactElement;
  fallback?: string;
}
export const AuthGuard: React.FC<AuthGuardProps> = props => {
  const { children } = props;
  const { user } = useContext(AuthUserContext);
  const router = useRouter();
  if (!user) {
    router.push('/');
  }
  return children;
};
