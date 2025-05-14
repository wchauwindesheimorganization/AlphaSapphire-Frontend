import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/Accordion"
import { useNavigate } from "@tanstack/react-router"
import { Project } from "@/models/entities/Project"
export default function AccordionProjects({ project }: { project: Project }) {
    const navigate = useNavigate()
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="text-left" ><p onClick={(e) => {
                    e.stopPropagation()
                    navigate({
                        to: `/projects/${project.Id}`,

                    })
                }}>{project.ProjectName}</p></AccordionTrigger>
                {project.Subprojects.length > 0 && project.Subprojects.map(subproject => {
                    return <AccordionContent className="text-left" key={subproject.Id}>
                        {subproject.SubprojectName}
                        <li><strong>Name:</strong> {subproject.SubprojectName}</li>
                        <li><strong>Lead Engineer:</strong> test</li>
                    </AccordionContent>
                })}
            </AccordionItem>
        </Accordion >
    )
}