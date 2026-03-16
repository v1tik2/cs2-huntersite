import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="relative min-h-screen bg-[#0b1118] text-white overflow-x-hidden">
        
        {/* Градієнтний фон */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          {/* базовий темний фон */}
          <div className="absolute inset-0 bg-[#0b1118]" />

          {/* верхнє світіння */}
          <div className="absolute top-[-200px] left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#1b2a3a] opacity-30 blur-[120px]" />

          {/* нижнє м'яке світіння */}
          <div className="absolute bottom-[-300px] right-[-200px] h-[600px] w-[600px] rounded-full bg-[#162331] opacity-40 blur-[140px]" />

          {/* шум */}
          <div className="absolute inset-0 bg-noise opacity-[0.03]" />
        </div>

        {children}
      </body>
    </html>
  );
}
