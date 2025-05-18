import { createFileRoute } from '@tanstack/react-router'
import { getProject } from '@/api/projectApi'
import { useEffect, useState } from 'react'
import { DataTable } from '@/components/Datatable'
import { SubprojectColumns } from '@/models/Columndefinitions/SubprojectColumns'
import { Project } from '@/models/entities/Project'
export const Route = createFileRoute('/projects/$projectid_')({
  component: RouteComponent,
})

function RouteComponent() {
  const { projectid }: { projectid: number } = Route.useParams()
  const [project, setProject] = useState<Project>()

  useEffect(() => {
    getProject({ id: projectid }).then((res) => {
      setProject(res)
    })
  }, [])
  return <div>
    {project?.Subprojects && <DataTable columns={SubprojectColumns()} data={project?.Subprojects}></DataTable>}
  </div>
}
