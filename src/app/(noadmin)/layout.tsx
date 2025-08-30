import { ClaimReport } from '@/shared/ui/ClaimReport';
import Footer from '@/widgets/footer/ui/Footer';
import { Header } from '@/widgets/header/ui/Header';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <ClaimReport />
    </>
  );
}
