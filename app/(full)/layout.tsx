import Header from "@/src/components/ui/header"
import Footer from "@/src/components/ui/footer"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <main>
        <Header/>
        {children}
        <Footer />
      </main>
  )
}