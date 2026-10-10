import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const links = [
  { label: 'Impact', href: '/#work' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Contact', href: '/#contact' },
];

export function HeaderNavigation({ showSections = true }: { showSections?: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  if (!showSections) return null;

  return (
    <>
      <nav className="hidden items-center gap-1 md:flex" aria-label="Section links">
        {links.map(({ label, href }) => (
          <a key={href} href={href} className={buttonVariants({ variant: 'ghost' })}>{label}</a>
        ))}
      </nav>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden" aria-label="Open portfolio navigation">
            <Menu />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="portfolio-navigation__menu"
        >
          {links.map(({ label, href }) => (
            <DropdownMenuItem key={href} asChild className="portfolio-navigation__item">
              <a href={href}>{label}</a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
