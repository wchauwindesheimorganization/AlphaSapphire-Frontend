import { Subproject } from "./Subproject";
import { User } from "./User";
export interface SubprojectLeadEngineer {
    Id: number;
    SubprojectId?: number;
    UserId?: number;
    Subproject?: Subproject;
    User: User;
}
