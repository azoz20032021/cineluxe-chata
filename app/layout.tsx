import './globals.css';
import Navbar from '@/components/Navbar'; // تأكد من المسار الصحيح للنافبار

export const metadata = {
  title: 'CineLuxe Chat',
  description: 'Real-time developer community',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#050505]">
        <Navbar />
        {children}
      </body>
    </html>
  );
}