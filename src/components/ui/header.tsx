import { ModeToggle } from "@/src/components/ui/theme-toogle";

export function Header() {
    return (
        <header>
            <div className="flex justify-between py-2 shadow-sm w-full px-4">
                <p className="text-3xl font-bold">Evenn</p>
                <ModeToggle />
            </div>
        </header>
    )
}