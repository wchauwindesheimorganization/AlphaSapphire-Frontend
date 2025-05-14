import { Department } from "./Department";
import { ProjectManager } from "./ProjectManager";
import { Subproject } from "./Subproject";
export interface Project {
    Id: number;
    ProjectName: string;
    ProjectDescription?: string;
    ProjectNumber?: string;
    ProjectNumberExtern?: string;
    DepartmentId: number;
    DateCreated: Date;
    DateLastEdited: Date;
    Department: Department;
    // ProjectLogs: ProjectLog[];
    ProjectManagers: ProjectManager[];
    Subprojects: Subproject[];
}


