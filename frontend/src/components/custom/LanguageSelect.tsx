import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { languages } from '@/models/languages';

export function LanguageSelect({
  value,
  onChange,
}: {
  value?: string;
  onChange: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = languages.find((l) => l.code === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between">
          {selected ? `${selected.native} (${selected.english})` : 'Select language'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] m:w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandEmpty>No language found.</CommandEmpty>
          <CommandGroup>
            {languages.map((lang) => (
              <CommandItem
                key={lang.code}
                value={lang.native}
                onSelect={() => {
                  onChange(lang.code);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn('mr-2 h-4 w-4', value === lang.code ? 'opacity-100' : 'opacity-0')}
                />
                {lang.native} <span className="ml-1 text-muted-foreground">({lang.english})</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
