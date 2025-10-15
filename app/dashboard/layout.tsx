import TBar from "@/src/components/ui/tbar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <TBar />
      <main className="w-4/5 float-right">
        {children}
      </main>
    </div>
  )
}