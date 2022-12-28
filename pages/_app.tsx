import '@src/styles/globals.css';

import { logAnalyticsEvent, useGeolocation } from '@src/lib';

import type { AppProps } from 'next/app';
import { Layout } from '@src/components';
import { ProvidersWrapper } from '@src/components/ProvidersWrapper';
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';

const setCookies = () => {
  setTimeout(() => {
    const gtmCookie = document.cookie
      .split(';')
      .map(item => {
        const splitItems = item.split('=');
        const key = splitItems[0].trim().split('"').join('');
        const value = splitItems[1];
        return { [key]: value };
      })
      .filter(item => item._ga)[0]
      ?._ga?.substring(6);

    console.log('[gtmCookie]', gtmCookie);
  }, 8000);
};

export default function App({ Component, pageProps }: AppProps) {
  const { longitude, latitude, error } = useGeolocation();

  // location api disabled
  if (error) {
    logAnalyticsEvent('geolocation_disabled', {});
    return (
      <Layout>
        <div className="portrait:w-screen portrait:h-screen  landscape:w-[100vh] landscape:h-[100vw] flex flex-col justify-center items-center">
          <p className="text-center font-semibold">Uh-oh! We dont know where you are</p>
          <p className="text-center font-extralight">Please share your location to access Cleanrooms services</p>
        </div>
      </Layout>
    );
  }

  if (longitude && latitude) {
    return (
      <>
        <Script id="google-analytics-script" strategy="afterInteractive" onReady={setCookies}>
          {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NJF8WS7');
          `}
        </Script>
        <ProvidersWrapper>
          <Layout>
            <Toaster position="top-left" />
            <Component {...pageProps} coords={{ longitude, latitude }} geoError={error} />
          </Layout>
        </ProvidersWrapper>
      </>
    );
  }

  return null;
}
