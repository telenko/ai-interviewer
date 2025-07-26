import { LanguageSelect } from '@/components/custom/LanguageSelect';
import { Button } from '@/components/ui/button';
import {
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import InterviewerApi from '@/services/InterviewerApi';
import { useAddVacancyMutation } from '@/services/vacancyApi';
import {
  Loader2Icon,
  PlusIcon,
  ClipboardPaste,
  ArrowLeft,
  Info,
  Link2,
  Type,
  ListChecks,
  Building2,
  Briefcase,
  X,
  Check,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const ErrorLayout = (props: { msg: string }) => (
  <p
    className="mt-1 text-sm text-red-600 break-words sm:absolute bottom-[-20px] left-1 max-w-[300px] sm:max-w-full"
    title={props.msg}
  >
    {props.msg}
  </p>
);

export default function AddVacancyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [inputSkill, setInputSkill] = useState('');
  const [loadingFromUrl, setLoadingFromUrl] = useState(false);
  const [langCode, setLangCode] = useState<string>();
  const [addVacancy, { isLoading: vacancyCreationLoading }] = useAddVacancyMutation();
  const [touched, setTouched] = useState<{
    title?: boolean;
    url?: boolean;
    skills?: boolean;
    company?: boolean;
  }>({});
  const { t } = useTranslation();

  const closeModal = useCallback(() => {
    setUrl('');
    setTitle('');
    setSkills([]);
    setLangCode('');
    setCompany('');
    setTouched({});
    onClose();
  }, [onClose]);

  const validationSchema = useMemo(
    () =>
      z.object({
        title: z
          .string()
          .max(30, t('createVacancy.errors.title', { min: 3, max: 30 }))
          .min(3, t('createVacancy.errors.title', { min: 3, max: 30 })),
        skills: z
          .array(
            z
              .string()
              .max(30, t('createVacancy.errors.skill', { min: 2, max: 30 }))
              .min(2, t('createVacancy.errors.skill', { min: 2, max: 30 })),
          )
          .max(30, t('createVacancy.errors.skillsMax', { max: 30 }))
          .min(1, t('createVacancy.errors.skillsMin', { min: 30 })),
        url: z.union(
          [z.url(t('createVacancy.errors.url')), z.literal('')],
          t('createVacancy.errors.url'),
        ),
        company: z.union(
          [
            z
              .string()
              .min(3, t('createVacancy.errors.company', { min: 3, max: 30 }))
              .max(30, t('createVacancy.errors.company', { min: 3, max: 30 })),
            z.string().length(0),
          ],
          t('createVacancy.errors.company', { min: 3, max: 30 }),
        ),
      }),
    [],
  );

  const computedSkills = useMemo(
    () => (skills.length > 0 ? skills : [inputSkill]),
    [skills, inputSkill],
  );
  const validation = useMemo(
    () =>
      validationSchema.safeParse({
        title,
        skills: computedSkills,
        url,
        company,
      }),
    [url, title, computedSkills, company],
  );
  const isValid = !validation.error;

  const titleIssue = useMemo(
    () => validation?.error?.issues?.find((iss) => iss.path.includes('title')),
    [validation],
  );
  const urlIssue = useMemo(
    () => validation?.error?.issues?.find((iss) => iss.path.includes('url')),
    [validation],
  );
  const skillsIssue = useMemo(
    () => validation?.error?.issues?.find((iss) => iss.path.includes('skills')),
    [validation],
  );
  const companyIssue = useMemo(
    () => validation?.error?.issues?.find((iss) => iss.path.includes('company')),
    [validation],
  );

  useEffect(() => {
    if (!open) return;

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      closeModal();
      window.history.pushState(null, '', window.location.href); // блокуємо навігацію назад
    };

    window.history.pushState(null, '', window.location.href); // додаємо новий запис в історію
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [open, closeModal]);

  const onAutofill = async () => {
    setLoadingFromUrl(true);
    if (!url) {
      return;
    }
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
      setCompany(vacancyCut.company || '');
      setTouched((prev) => ({
        ...prev,
        title: true,
        skills: true,
      }));
    } finally {
      setLoadingFromUrl(false);
    }
  };

  const addSkill = () => {
    const newSkill = inputSkill.trim().slice(0, 30);
    if (newSkill && !skills.includes(newSkill)) {
      setSkills((prev) => [...prev, newSkill]);
    }
    setInputSkill('');
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && closeModal()}>
      <DialogContent className="w-full h-screen sm:max-h-screen overflow-y-auto max-w-none rounded-none sm:max-w-lg sm:h-auto sm:rounded-xl">
        <DialogHeader className="flex flex-row items-center justify-between px-1 sm:px-0">
          <Button
            variant="outline"
            size="icon"
            onClick={closeModal}
            className="absolute left-5 sm:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <DialogTitle className="text-3xl sm:text-2xl font-semibold flex-1 text-center sm:text-left w-full flex items-center gap-3">
            <Briefcase className="w-6 h-6 text-gray-600" />
            {t('new_vacancy')}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-7 pb-4 pt-2 mt-0">
          {/* URL + кнопка */}
          <div className="relative">
            <div className="flex gap-2 relative items-center">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                className="text-lg pl-10 py-8 blink-green-border placeholder:text-base pr-15 sm:pr-4"
                placeholder={t('gentle_url_placeh')}
                value={url}
                onBlur={() => {
                  setTouched((prev) => ({
                    ...prev,
                    url: true,
                  }));
                }}
                onChange={(e) => {
                  setUrl(e.target.value);
                }}
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
                    className="absolute right-13 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition text-white px-4 py-2 rounded-md md:hidden"
                    aria-label="Вставити з буфера"
                    type="button"
                  >
                    <ClipboardPaste className="w-5 h-5" />
                  </Button>
                </>
              ) : null}
              {url ? (
                <Button
                  variant="secondary"
                  onClick={onAutofill}
                  className="h-16 text-base cursor-pointer"
                  disabled={loadingFromUrl || !!urlIssue?.message}
                >
                  {loadingFromUrl ? (
                    <Loader2Icon className="w-4 h-4 animate-spin" />
                  ) : (
                    t('generate')
                  )}
                </Button>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="cursor-pointer p-1.5 rounded-sm bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-800 shadow-sm transition-colors duration-200"
                    >
                      <Info className="w-5 h-5" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <p className="font-semibold text-gray-800">
                      {t('createVacancy.generate_hint.title')}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {t('createVacancy.generate_hint.subTitle')}
                    </p>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            {touched.url && urlIssue?.message ? <ErrorLayout msg={urlIssue?.message} /> : null}
          </div>

          {/* Title */}
          <div className="relative">
            <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder={t('vacancy_name')}
              className="pl-10"
              value={title}
              onBlur={() => {
                setTouched((prev) => ({
                  ...prev,
                  title: true,
                }));
              }}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            {touched.title && titleIssue?.message ? (
              <ErrorLayout msg={titleIssue?.message} />
            ) : null}
          </div>

          {/* Multi-skill input */}
          <div className="relative">
            <div className="flex gap-2 mb-2 relative">
              <ListChecks className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder={t('enter_skills')}
                value={inputSkill}
                className="pl-10"
                onBlur={() => {
                  setTouched((prev) => ({
                    ...prev,
                    skills: true,
                  }));
                }}
                onChange={(e) => {
                  setInputSkill(e.target.value);
                }}
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
            <div className="flex flex-wrap gap-2 max-h-auto sm:max-h-[150px] overflow-y-auto mb-[-8px]">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-indigo-600 hover:text-red-500 text-[10px]"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            {touched.skills && skillsIssue?.message ? (
              <ErrorLayout msg={skillsIssue?.message} />
            ) : null}
          </div>

          {/* Company */}
          <div className="relative flex items-center gap-2">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder={t('createVacancy.company_name')}
              className="pl-10"
              value={company}
              onBlur={() => {
                setTouched((prev) => ({
                  ...prev,
                  company: true,
                }));
              }}
              onChange={(e) => {
                setCompany(e.target.value);
              }}
            />
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="cursor-pointer p-1.5 rounded-sm bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-800 shadow-sm transition-colors duration-200"
                >
                  <Info className="w-5 h-5" />
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <p className="text-sm text-gray-600 mt-1">{t('company_name_hint')}</p>
              </PopoverContent>
            </Popover>
            {touched.company && companyIssue?.message ? (
              <ErrorLayout msg={companyIssue?.message} />
            ) : null}
          </div>

          {/* Lang_code */}
          <LanguageSelect value={langCode} onChange={setLangCode} />
        </div>
        {/* on some mobile devices bottom of footer not visible, so adding mb-4 */}
        <DialogFooter className="mt-4 mb-4 sm:mb-0">
          <Button onClick={closeModal} variant="outline">
            <X />
            <span className="text-left">{t('cancel')}</span>
          </Button>
          <Button
            onClick={() => {
              addVacancy({
                langCode,
                title,
                skills: skills.length > 0 ? skills : [inputSkill],
                url,
                company,
              }).then((e) => (!e.error ? closeModal() : null));
            }}
            disabled={!isValid}
          >
            {vacancyCreationLoading ? <Loader2Icon className="animate-spin" /> : <Check />}
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
