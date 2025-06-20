import { Mandate } from "./Mandate";
import { Subproject } from "./Subproject";
export interface Activity {
    Id: number;
    SubprojectId?: number;
    ActivityName?: string;
    RequiredMandate?: number;
    ActivityOrder?: number;
    // ActivityLeaders: ActivityLeader[];
    // ActivityLogs: ActivityLog[];
    Documents: Document[];
    // Issues: Issue[];
    RequiredMandateNavigation?: Mandate;
    Subproject?: Subproject;
}
