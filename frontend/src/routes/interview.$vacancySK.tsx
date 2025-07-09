import Interview from '@/modules/Interview'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/interview/$vacancySK')({
  component: RouteComponent,
})

function RouteComponent() {
  const { vacancySK } = Route.useParams()
  return <Interview vacancySK={vacancySK} />
}
