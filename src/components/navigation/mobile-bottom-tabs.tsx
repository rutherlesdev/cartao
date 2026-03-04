import { appTabs, type TabId } from "./tabs";

interface MobileBottomTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function MobileBottomTabs({ activeTab, onTabChange }: MobileBottomTabsProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-[var(--surface-paper)] pb-[env(safe-area-inset-bottom)] shadow-[0_-1px_10px_-2px_rgba(0,0,0,0.08)] lg:hidden"
      aria-label="Navegacao por abas"
    >
      <div className="flex min-h-14 items-stretch justify-around">
        {appTabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-1 px-1 py-1.5 transition-colors ${
                active ? "text-primary" : "text-muted-foreground active:text-foreground"
              }`}
              aria-label={label}
              aria-current={active ? "page" : undefined}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  active ? "bg-primary/15" : ""
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.8} />
              </div>
              <span
                className={`text-xs leading-tight ${
                  active ? "font-bold" : "font-medium"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

