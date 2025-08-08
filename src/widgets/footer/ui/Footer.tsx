import Link from 'next/link';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: 'О проекте',
    links: [
      { label: 'О нас', href: '/about' },
      { label: 'Контакты', href: '/contacts' },
      { label: 'Правила', href: '/rules' },
    ],
  },
  {
    title: 'Навигация',
    links: [
      { label: 'Стихи', href: '/poems' },
      { label: 'Категории', href: '/categories' },
      { label: 'Авторы', href: '/authors' },
    ],
  },
  {
    title: 'Правовая информация',
    links: [
      { label: 'Условия использования', href: '/terms' },
      { label: 'Политика конфиденциальности', href: '/privacy' },
      { label: 'Правила публикации', href: '/publishing-rules' },
    ],
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-muted py-8 border-t">
      <div className="container-section">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {footerSections.map(section => (
            <div key={section.title} className="space-y-3">
              <h3 className="flex justify-center md:justify-start text-sm font-medium">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li
                    key={link.href}
                    className="flex justify-center md:justify-start hover:text-foreground transition-colors"
                  >
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Christian Poetry. Все права защищены.
          </p>
          <div className="flex gap-4">
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Facebook
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Twitter
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Instagram
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
