'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigationItems = [
  { href: '/', label: 'Accueil', description: 'Dashboard principal' },
  { href: '/tasks', label: 'Tâches', description: 'Gestion des tâches' },
  { href: '/timers', label: 'Focus', description: 'Minuteurs et concentration' },
  { href: '/cognitive', label: 'Jeux', description: 'Stimulation cognitive' },
  { href: '/emotion', label: 'Bien-être', description: 'Gestion émotionnelle' },
  { href: '/analytics', label: 'Progrès', description: 'Suivi et analyses' },
];

export function NavigationBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-6 gap-1 p-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200",
                  "text-xs font-medium min-h-[60px]",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
                aria-label={item.description}
              >
                <span className="text-center leading-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
