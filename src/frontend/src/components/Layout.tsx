import { BriefcaseIcon, SparklesIcon } from "lucide-react";

interface LayoutProps {
  sidebarContent: React.ReactNode;
  mainContent: React.ReactNode;
}

export function Layout({ sidebarContent, mainContent }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-30">
        <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <BriefcaseIcon size={16} className="text-primary-foreground" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-lg text-foreground tracking-tight">
                HireAI
              </span>
              <span className="hidden sm:inline text-xs text-muted-foreground font-body">
                Intelligent Recruitment Powered by AI
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <SparklesIcon size={13} className="text-primary" />
            <span>AI-Powered</span>
          </div>
        </div>
      </header>

      {/* Page title bar */}
      <div className="bg-muted/40 border-b border-border px-6 py-4">
        <div className="max-w-screen-2xl mx-auto">
          <h1 className="font-display font-semibold text-xl text-foreground">
            New Candidate Evaluation
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Fill in the job details and optionally upload a resume to generate a
            complete recruitment package.
          </p>
        </div>
      </div>

      {/* Dashboard layout */}
      <div className="flex-1 max-w-screen-2xl mx-auto w-full px-6 py-6">
        <div className="flex gap-6 items-start">
          {/* Sticky left sidebar — form */}
          <aside className="w-80 flex-shrink-0 sticky top-[120px] max-h-[calc(100vh-136px)] overflow-y-auto">
            {sidebarContent}
          </aside>

          {/* Scrollable right main area — results */}
          <main className="flex-1 min-w-0 space-y-4" data-ocid="results-area">
            {mainContent}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-auto">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline transition-smooth"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
