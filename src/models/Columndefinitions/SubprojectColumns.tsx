import { ColumnDef, Row } from "@tanstack/react-table";
import { Subproject } from "../entities/Subproject";



export const SubprojectColumns = (): ColumnDef<Subproject>[] => [
    {
        accessorKey: "Id",
        header: "ID",
        cell: ({ row }: { row: Row<Subproject> }) => {
            const subproject = row.original;
            return <span>{subproject.Id}</span>;
        },
    },
    {
        accessorKey: "SubprojectName",
        header: "Name",
        cell: ({ getValue }: { row: Row<Subproject>; getValue: () => unknown }) => {
            return (
                <span
                >
                    {getValue() as string}
                </span>
            );
        },
    },
    {
        accessorKey: "SubprojectLeadEngineers",
        header: "Lead Engineers",
        cell: ({ row }: { row: Row<Subproject> }) => {
            const subproject = row.original;
            console.log(subproject.SubprojectLeadEngineers ? 1 : 2);
            return subproject.SubprojectLeadEngineers ? <span>{subproject.SubprojectLeadEngineers.map((leadEngineer) => leadEngineer.User.FirstName + " " + leadEngineer.User.LastName).join(", ")}</span> :
                <span>None</span>;
            ;
        }
    }
    , {
        accessorKey: "SubprojectAssistants",
        header: "Subproject Assistants",
        cell: ({ row }: { row: Row<Subproject> }) => {
            const subproject = row.original;
            return <span>{subproject.SubprojectAssistants.map((assistant) => assistant.User.FirstName + " " + assistant.User.LastName).join(", ")}</span>;
        }
    }

];