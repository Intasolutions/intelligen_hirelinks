import './globals.css';
import 'flag-icons/css/flag-icons.min.css';

export const metadata = {
  title: 'Intelligen Hirelinks',
  description: 'Content Management Platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
