import { Button } from '@/components/ui/button';
import {
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import InterviewerApi from '@/services/InterviewerApi';
import { useAddVacancyMutation } from '@/services/vacancyApi';
import { Loader2Icon, PlusIcon } from 'lucide-react';
import { useState } from 'react';

export default function AddVacancyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [inputSkill, setInputSkill] = useState('');
  const [loadingFromUrl, setLoadingFromUrl] = useState(false);
  const [addVacancy, { isLoading: vacancyCreationLoading }] = useAddVacancyMutation();

  const isValid = !!title && skills.length > 0;

  const onAutofill = async () => {
    setLoadingFromUrl(true);
    if (!url) {
      return;
    }
    // Симуляція запиту
    try {
      const response = await InterviewerApi.post('/vacancy-session', {
        operation: 'generate_vacancy',
        payload: {
          url,
        },
      });
      const vacancyCut = response.data.vacancy_cut;
      setTitle(vacancyCut.title);
      setSkills(vacancyCut.skills);
    } finally {
      setLoadingFromUrl(false);
    }
  };

  const addSkill = () => {
    if (inputSkill.trim() && !skills.includes(inputSkill.trim())) {
      setSkills((prev) => [...prev, inputSkill.trim()]);
    }
    setInputSkill('');
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Нова вакансія</DialogTitle>
        </DialogHeader>

        {/* URL + кнопка */}
        <div className="flex gap-2">
          <Input
            className="py-8 blink-green-border placeholder:text-lg"
            placeholder="Встав URL вакансії :) Так буде швидше!!"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {url && (
            <Button
              variant="secondary"
              onClick={onAutofill}
              className="h-16 text-lg"
              disabled={loadingFromUrl}
            >
              {loadingFromUrl ? <Loader2Icon className="w-4 h-4 animate-spin" /> : 'Згенерувати'}
            </Button>
          )}
        </div>

        {/* Title */}
        <Input
          placeholder="Назва вакансії"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Multi-skill input */}
        <div>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Введіть скіл..."
              value={inputSkill}
              onChange={(e) => setInputSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
            <Button variant="outline" size="icon" className="size-9" onClick={addSkill}>
              <PlusIcon />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="text-indigo-600 hover:text-red-500"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={onClose} variant="outline">
            Скасувати
          </Button>
          <Button
            onClick={() => {
              addVacancy({
                title,
                skills,
                url,
              }).then(onClose);
            }}
            disabled={!isValid}
          >
            {vacancyCreationLoading ? <Loader2Icon className="animate-spin" /> : null}
            Зберегти
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
