import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
    component: RouteComponent,
})


function RouteComponent() {

    return <div>Hey! Glad you are here. This is dummy ai interviewer app, which is gonna help you with preparations! I can assure you with that!</div>
}
