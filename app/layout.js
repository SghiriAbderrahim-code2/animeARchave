
import NaveBar from '../components/NaveBar';
import BackToTop from '../components/BackToTop';
import './globals.css';

export const metadata = {
  title: 'AnimeARchive',
  description: 'Archive of Anime',
};



export default function RootLayout({ children }) {

  return (
    <html lang="en" className="dark h-screen" suppressHydrationWarning>
      <body className=" bg-[var(--bg)] ">
        <NaveBar />
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
