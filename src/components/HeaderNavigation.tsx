import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,
} from '@/components/ui/sheet';

const links = [
  { label: 'Impact', href: '/#work' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Contact', href: '/#contact' },
];

export function HeaderNavigation() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  return (
    <>
      <nav className="hidden items-center gap-1 md:flex" aria-label="Section links">
        {links.map(({ label, href }) => (
          <a key={href} href={href} className={buttonVariants({ variant: 'ghost' })}>{label}</a>
        ))}
      </nav>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden" aria-label="Open navigation">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>Explore the portfolio.</SheetDescription>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-4" aria-label="Mobile section links">
            {links.map(({ label, href }) => (
              <SheetClose asChild key={href}>
                <a href={href} className={buttonVariants({ variant: 'ghost' })}>{label}</a>
              </SheetClose>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
