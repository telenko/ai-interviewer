import React, { useMemo } from 'react';
import { useMatches, Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export const Breadcrumbs = (props: { className?: string }) => {
  const matches = useMatches();
  const { t } = useTranslation();

  // Знайдемо матч маршруту за id або path — наприклад, по id
  const interviewMatch = matches.find((m) => m.fullPath === '/interview/$vacancySK');

  const items = useMemo(() => {
    const baseItems = [
      {
        url: '/vacancies',
        label: t('navigation.home'),
      },
    ];

    if (interviewMatch) {
      baseItems.push({
        url: interviewMatch.pathname,
        label: t('navigation.interview'),
      });
    }

    return baseItems;
  }, [interviewMatch]);

  return (
    <Breadcrumb {...props}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          if (isLast) {
            return (
              <BreadcrumbItem key={`breadcrumb-fragment-${item.url}`}>
                <BreadcrumbLink asChild>
                  <Link to={item.url} className="hover:underline">
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            );
          } else {
            return (
              <React.Fragment key={`breadcrumb-fragment-${item.url}`}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={item.url} className="hover:underline">
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </React.Fragment>
            );
          }
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
