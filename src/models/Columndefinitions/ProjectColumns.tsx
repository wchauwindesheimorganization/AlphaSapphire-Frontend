import { ColumnDef, Row } from "@tanstack/react-table";
import { Project } from "@/models/entities/Project";
import AccordionProjects from "@/components/AccordionProjects";
export const ProjectColumns = (): ColumnDef<Project>[] => [
    {
        accessorKey: "Id",
        header: "ID",
        cell: ({ getValue }: { getValue: () => unknown }) => <span>{String(getValue())}</span>,
    },
    {
        accessorKey: "ProjectName",
        header: "Project",
        cell: ({ row }: { row: Row<Project> }) => {
            return <AccordionProjects project={row.original} />
        },
    }
];