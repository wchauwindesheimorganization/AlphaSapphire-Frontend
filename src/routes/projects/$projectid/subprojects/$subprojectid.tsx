import { createFileRoute } from '@tanstack/react-router'
import { getSubprojectsBySubprojectId } from '@/api/subprojectApi'
import { useEffect, useState } from 'react'
export const Route = createFileRoute(
  '/projects/$projectid/subprojects/$subprojectid',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { projectid, subprojectid }: { projectid: number; subprojectid: number } =
    Route.useParams()
  const [subproject, setSubproject] = useState<any>()
  useEffect(() => {
    getSubprojectsBySubprojectId({
      projectid: projectid,
      subprojectid: subprojectid,
    }).then((res) => {
      setSubproject(res)
    })
  }, [])
  console.log('subproject', subproject)
  return <div>Hello "/projects/$projectid/subprojects/$subprojectid"!</div>
}
