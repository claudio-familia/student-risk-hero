import React, { useContext } from "react";
import AuthContext from "../../../store/auth-context";

import AssignmentTeacher from "./AssignmentTeachers";
import AssignmentStudents from "./AssignmentStudents";
import AuthUtil from "../../../utils/auth";

const AssignmentsPage = () => {
    const context = useContext(AuthContext)
    const profile = AuthUtil.getTokenData(context.token);

    const isStudent = profile["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "Student";
    return (
        <React.Fragment>
            {!isStudent && <AssignmentTeacher />}
            {isStudent && <AssignmentStudents />}
        </React.Fragment>
    );
}

export default AssignmentsPage;