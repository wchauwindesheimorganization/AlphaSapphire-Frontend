import { createFileRoute } from '@tanstack/react-router'
import { api } from '@/Api'
export const Route = createFileRoute('/test')({
  component: RouteComponent,
})

function RouteComponent() {
  api.get('/api/test').then((response) => {
    console.log(response.data);
  })
  return <div>Hello "/test"!</div>
}
