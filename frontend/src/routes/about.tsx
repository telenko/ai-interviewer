import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: AboutPage,
});

function UkraineSupportFlag() {
  const handleClick = () => {
    window.open('https://war.ukraine.ua/', '_blank'); // або https://u24.gov.ua/
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            className="rounded-full hover:scale-105 transition-transform cursor-pointer"
          >
            <img
              src="https://flagcdn.com/w40/ua.png"
              alt="Ukraine"
              title="Proud to be ukrainian"
              className="h-5 w-auto rounded-sm shadow-sm"
            />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Допомогти Україні</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
      <Card className="p-6 space-y-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">About This App</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground text-sm leading-relaxed">
          <p>
            This app helps you prepare for job interviews in a structured and interactive way. You
            can track your progress, score your answers, and practice realistic questions tailored
            to your role.
          </p>
          <p>
            Built using modern web technologies like React, Tailwind CSS, TanStack Router, and
            shadcn/ui, the app is designed for speed, simplicity, and user focus.
          </p>
        </CardContent>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-6 items-start">
          <Avatar className="w-36 h-36 mx-auto md:mx-0">
            <AvatarImage src="/avatar.jpg" alt="Author" />
            <AvatarFallback>AU</AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <div className="flex flex-row items-center gap-3">
              <h2 className="text-lg font-semibold">About the Author</h2>
              <UkraineSupportFlag />
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Hi! I'm Andrii Telenko, a software engineer passionate about building clean,
              accessible, and AI-assisted tools that help people grow. I love React, serverless
              technologies, and UI/UX design.
            </p>
            <p className="text-sm text-muted-foreground">
              In my free time, I enjoy creating side projects, exploring tech trends, and spending
              time with my daughter.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
