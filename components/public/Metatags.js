import Head from 'next/head';
import { env } from 'next-runtime-env';

export default function Metatags({ children }) {
  const title = 'MART | Sample App Retail Demo';
  const description = "A sample retail demo application built on top of NCR's APIs.";
  const socialImage = `mart.png`;
  const appUri = env('NEXT_PUBLIC_APP_URI');
  
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />

        <meta itemProp="name" content={title} />
        <meta itemProp="description" content={description} />
        <meta itemProp="image" content={socialImage} />

        <meta property="og:url" content={appUri} />
        <meta property="og:type" content="website" />
        <meta itemProp="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={socialImage} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={appUri} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={socialImage} />
      </Head>
      {children}
    </div>
  );
}
