import { User } from "./User";
import { Subproject } from "./Subproject";
export interface SubprojectProcessValidator {
    Id: number;
    SubprojectId: number;
    UserId: number;
    Subproject: Subproject;
    User: User;
}
