import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Loader = ({ text }: { text?: string }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <Card className="p-8 flex flex-col items-center gap-4 shadow-lg">
        <Loader2 className="h-15 w-15 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground font-medium">{text || 'Loading...'}</p>
      </Card>
    </div>
  );
};

export default Loader;
