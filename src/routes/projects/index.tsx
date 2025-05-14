import { createFileRoute, createRouter } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getProjects } from '@/api/projectApi'
import { Project } from '@/models/entities/Project'
import { ProjectColumns } from '@/models/Columndefinitions/ProjectColumns'
import { DataTable } from '@/components/Datatable'


export const Route = createFileRoute('/projects/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [projects, setProjects] = useState<Project[]>()
  useEffect(() => {
    getProjects().then((res) => {
      setProjects(res)
    })
  }
    , [])
  return (<>
    {projects && <DataTable columns={ProjectColumns()} data={projects} />}


  </>)
}

