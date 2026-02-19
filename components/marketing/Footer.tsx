export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 text-sm md:flex-row md:px-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gradient-to-br from-primary to-primary/80 p-1.5 shadow-sm">
            <span className="text-xs font-bold text-primary-foreground">CD</span>
          </div>
          <div>
            <span className="font-bold text-foreground">Cedewise Direct</span>
            <span className="ml-2 text-muted-foreground">© {new Date().getFullYear()}</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="font-medium text-muted-foreground transition-colors hover:text-primary">Privacy</a>
          <a href="#" className="font-medium text-muted-foreground transition-colors hover:text-primary">Terms</a>
          <a href="#" className="font-medium text-muted-foreground transition-colors hover:text-primary">Security</a>
        </div>
      </div>
    </footer>
  );
}

