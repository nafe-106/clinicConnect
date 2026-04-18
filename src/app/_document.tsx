import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="bn">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#6366f1" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
