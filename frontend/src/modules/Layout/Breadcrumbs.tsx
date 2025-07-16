import { useMemo } from 'react';
import { useMatches, Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';

export const Breadcrumbs = () => {
  const matches = useMatches();

  // Знайдемо матч маршруту за id або path — наприклад, по id
  const interviewMatch = matches.find((m) => m.fullPath === '/interview/$vacancySK');

  const items = useMemo(() => {
    const baseItems = [
      {
        url: '/vacancies',
        label: 'Vacancies',
      },
    ];

    if (interviewMatch) {
      baseItems.push({
        url: interviewMatch.pathname,
        label: 'Interview',
      });
    }

    return baseItems;
  }, [interviewMatch]);

  return (
    <nav
      aria-label="Breadcrumb"
      className="text-sm text-gray-600 items-center mt-1 ml-10 hidden sm:flex"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.label} className="flex items-center">
            {!isLast ? (
              <>
                <Link to={item.url} className="hover:underline">
                  {item.label}
                </Link>
                <ChevronRight className="w-4 h-4 mx-2" />
              </>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
};
