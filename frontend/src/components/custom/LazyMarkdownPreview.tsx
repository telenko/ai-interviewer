import React, { Suspense } from 'react';
import type { MarkdownPreviewProps } from '@uiw/react-markdown-preview';
import { Skeleton } from '@/components/ui/skeleton';

const MarkdownPreview = React.lazy(() => import('@uiw/react-markdown-preview'));

const LazyMarkdownPreview: React.FC<MarkdownPreviewProps> = (props) => {
  return (
    <Suspense
      fallback={
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      }
    >
      <MarkdownPreview {...props} />
    </Suspense>
  );
};

export default LazyMarkdownPreview;
