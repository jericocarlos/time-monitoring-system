import './globals.css';

export const metadata = {
  title: 'Time Tracking System',
  description: 'Track employee time efficiently',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body 
        className="min-h-screen bg-gray-100" 
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}