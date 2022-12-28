import { auth, googleAuthProvider } from '@src/lib';
import { signInAnonymously, signInWithPopup } from '@firebase/auth';

import { AuthUserContext } from '@src/lib';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import toast from 'react-hot-toast';
import { useContext } from 'react';
import { useRouter } from 'next/router';

const Index = () => {
  const { user } = useContext(AuthUserContext);
  const router = useRouter();
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      toast.error('Sign in failed');
    }
  };
  const handleAnonymousLogin = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      toast.error('Anonymous sign in failed');
    }
  };

  if (user) {
    router.push('/restaurant-list');
  }

  if (!user) {
    return (
      <div className="bg-login-background w-screen h-screen flex flex-col justify-between items-center relative overflow-y-auto overflow-x-hidden">
        <Head>
          <title>Signup page</title>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
        </Head>
        <p className="font-paprika  w-screen px-5 py-3 font-normal text-xl text-left  text-white z-10">cleanr</p>
        <div className="absolute top-0 w-screen h-screen overflow-hidden bg-login-background">
          {/*eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="object-fill w-full landscape:h-[100vw]"
            src={'/assets/loginbg.png'}
            alt={'login background image'}
          />
        </div>
        <div className="w-full pb-8  p-4 flex items-end justify-start bg-login-background">
          <div className="w-full  flex flex-col items-start gap-3">
            <div className="flex flex-col gap-0 items-start w-full ml-2 z-10">
              <p className="text-[24px] text-white font-paprika font-normal">CleanRooms</p>
              <p className="text-[15px] text-login-offWhite font-thin font-paprika mt-2 mb-2">
                Find clean restrooms on the go
              </p>
            </div>
            <div
              className="w-full h-14 max-xs:h-16 bg-white rounded-lg flex justify-center items-center z-10"
              onClick={handleGoogleLogin}
            >
              <div className="w-4/5 h-full flex space-x-2 items-center justify-center ">
                <Image src="/googleicon.png" alt="google icon" width={30} height={30} />
                <p className="text-gray-500 text-xl font-medium font-roundedmplus ">Sign In with Google</p>
              </div>
            </div>

            <div className="w-full h-10 text-2xl text-white flex justify-center items-center z-10">
              <p className="font-ptsans ">or</p>
            </div>
            <div
              className="w-full h-14 bg-gray-300 bg-opacity-40 max-xs:h-16  rounded-lg flex justify-center items-center z-10"
              onClick={handleAnonymousLogin}
            >
              <p className="text-white text-2xl font-normal  max-xs:text-xl font-ptsans">Skip</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
export default Index;
