import UpperInfoBar from "@/components/global/upper-info-bar";
// globals moved to app/globals.css
import Footer from "@/components/Footer";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <UpperInfoBar />
      {children}
      <Footer />
    </>
  );
}
