import { Project } from "./Project";
import { Activity } from "./Activity";
import { SubprojectAssistant } from "./SubprojectAssistant";
import { SubprojectManager } from "./SubprojectManager";
import { SubprojectLeadEngineer } from "./SubprojectLeadEngineer";
import { SubprojectProcessValidator } from "./SubprojectProcessValidator";
export interface Subproject {
    Id: number;
    SubprojectName: string;
    SubprojectDescription?: string;
    ProjectId: number;
    DateCreated: Date;
    DateLastEdited: Date;
    Activities: Activity[];
    Project: Project;
    SubprojectAssistants: SubprojectAssistant[];
    SubprojectLeadEngineers: SubprojectLeadEngineer[];
    // SubprojectLogs: SubprojectLog[];
    SubprojectManagers: SubprojectManager[];
    SubprojectProcessValidators: SubprojectProcessValidator[];
}


