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
import { Loader2Icon, PlusIcon, ClipboardPaste } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function AddVacancyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [inputSkill, setInputSkill] = useState('');
  const [loadingFromUrl, setLoadingFromUrl] = useState(false);
  const [addVacancy, { isLoading: vacancyCreationLoading }] = useAddVacancyMutation();
  const { t } = useTranslation();

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
      <DialogContent className="w-full h-screen max-w-none rounded-none sm:max-w-lg sm:h-auto sm:rounded-xl">
        <DialogHeader>
          <DialogTitle>{t('new_vacancy')}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-5">
          {/* URL + кнопка */}
          <div className="flex gap-2 relative">
            <Input
              className="py-8 blink-green-border placeholder:text-lg pr-15 sm:pr-4"
              placeholder={t('gentle_url_placeh')}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            {!url ? (
              <>
                <Button
                  onClick={async () => {
                    try {
                      const clipboardText = await navigator.clipboard.readText();
                      setUrl(clipboardText);
                    } catch {}
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition text-white px-4 py-2 rounded-md md:hidden"
                  aria-label="Вставити з буфера"
                  type="button"
                >
                  <ClipboardPaste className="w-5 h-5" />
                </Button>
              </>
            ) : null}
            {url && (
              <Button
                variant="secondary"
                onClick={onAutofill}
                className="h-16 text-lg"
                disabled={loadingFromUrl}
              >
                {loadingFromUrl ? <Loader2Icon className="w-4 h-4 animate-spin" /> : t('generate')}
              </Button>
            )}
          </div>

          {/* Title */}
          <Input
            placeholder={t('vacancy_name')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Multi-skill input */}
          <div>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder={t('enter_skills')}
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
        </div>
        <DialogFooter className="mt-4">
          <Button onClick={onClose} variant="outline">
            {t('cancel')}
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
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
