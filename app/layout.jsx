import './globals.css';

export const metadata = {
  title: 'XYPHER – Search the XYPHER way',
  description: 'A dark, fast Wikipedia-powered search engine.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
        </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
