import { User } from "@/models/entities/User";
import { Project } from "@/models/entities/Project";
export interface ProjectManager {
    Id: number;
    ProjectId: number;
    UserId: number;
    Project: Project;
    User: User;
}