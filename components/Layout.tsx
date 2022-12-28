import { Header } from './index';
import { ReactNode } from 'react';
import { useRouter } from 'next/router';
// add all layout related code and effects here
export const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { query } = router;
  if (query.id || query.restaurantId) {
    return (
      <>
        <Header version={1} />
        {children}
      </>
    );
  }
  return (
    <>
      <Header />
      {children}
    </>
  );
};
