import Head from 'next/head';

export default function Metatags({
  title = 'Next.js Blog',
  description = 'Projekt wykonany przez Tobiasza Musiała',
  image = 'https://miro.medium.com/max/1000/1*KDMx1YspSrBcFJG-NDZgDg.png',
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  );
}