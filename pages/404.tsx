import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

export default function PageNotFound() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center" id="rotatable">
      <Head>
        <title>404 page</title>
      </Head>
      <p className="text-3xl text-teal-700 max-md:text-2xl">Page Not Found</p>

      <Link href="/" className="my-4">
        Go back home
      </Link>
    </div>
  );
}
