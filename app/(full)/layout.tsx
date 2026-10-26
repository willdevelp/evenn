import Header from "@/src/components/ui/header";
import Footer from "@/src/components/ui/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <Footer /> 
    </div>
  );
}