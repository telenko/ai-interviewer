import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/vacancies')({
  component: RouteComponent,
})

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Vacancy } from '@/models/entities'
import { useEffect, useRef, useState } from 'react'
import InterviewerApi from '@/services/InterviewerApi'

function VacancyCard({ vacancy }: { vacancy: Vacancy }) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{vacancy.title}</CardTitle>
        <CardDescription>
          {vacancy.skills.slice(0, 5).join(', ')}
        </CardDescription>
        <CardAction>
          <Button variant="link">Remove</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              Progress: {vacancy.progress}
            </div>
            <div className="grid gap-2">
              Score: {vacancy.score}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Continue
        </Button>
      </CardFooter>
    </Card>
  )
}

function RouteComponent() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const hasFetched = useRef(false)
  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    InterviewerApi.post('/vacancy-session', {
      "operation": "get_vacancies",
      "payload": {}
    }).then(result => {
      setVacancies(result.data.vacancies)
    })
  }, [])
  return <div>{vacancies.map(vacancy => <VacancyCard key={vacancy.PK} vacancy={vacancy} />)}</div>
}
