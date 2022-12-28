import { AuthUserContext, useAuthUser } from '@src/lib';
import { ReactNode } from 'react';

export const ProvidersWrapper = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthUser();
  return <AuthUserContext.Provider value={{ user }}>{children}</AuthUserContext.Provider>;
};
