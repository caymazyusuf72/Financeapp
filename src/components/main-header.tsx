import { SidebarTrigger } from "@/components/ui/sidebar"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"
import { CustomizeView } from "./customize-view"

export function MainHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <div className="md:hidden">
            <SidebarTrigger />
        </div>
        <Icons.Logo className="h-6 w-6 text-primary" />
        <h1 className="font-headline text-xl font-semibold text-foreground">FinTrack</h1>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <CustomizeView />
        <ThemeToggle />
      </div>
    </header>
  )
}
