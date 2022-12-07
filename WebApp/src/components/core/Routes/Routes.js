import React from "react";
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import ForgotPassword from "../../../pages/Auth/ForgotPassword/ForgotPassword";
import Home from "../../../pages/Home/Home";
import Login from '../../../pages/Auth/Login/Login';
import SignUp from '../../../pages/Auth/SignUp/SignUp';
import Users from '../../../pages/Auth/Users/Users';
import ValidateUser from "../../../pages/Auth/ValidateUser/ValidateUser";
import AuthContext from "../../../store/auth-context";
import Layout from "../Layout/Layout";
import { useContext } from 'react';
import CoursePage from '../../../pages/School/Courses/Course';
import StudentPage from "../../../pages/Actors/Students/Students";
import CourseStudentPage from "../../../pages/School/Courses/Students/CourseStudent";
import RiskProfilePage from "../../../pages/School/RiskProfile/RiskProfile";
import RiskProfileDetailPage from "../../../pages/School/RiskProfile/RiskProfileDetails/RiskProfileDetails";
import AssignmentsPage from "../../../pages/School/Assignments/Assignments";
import AssignmentsStudentPage from "../../../pages/School/Assignments/AssignmentsForm/AssignmentsStudent";
import AuthUtil from "../../../utils/auth";

const Routes = () => {
    const authCtx = useContext(AuthContext)
    const session = AuthUtil.getTokenData(authCtx.token);
    const role = session ? session["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : undefined

    const unathorizedUrls = [
        <Route path="/login" key="/login">
            <Login />
        </Route>,
        <Route path="/sign-up" key="/sign-up">
            <SignUp />
        </Route>,
        <Route path="/validate-account/:user" key="/validate-account/:user">
            <ValidateUser />
        </Route>,
        <Route path="/forgot-password" exact key="/forgot-password">
            <ForgotPassword />
        </Route>,
        <Route path="/forgot-password/:token" key="/forgot-password/:token">
            <ForgotPassword />
        </Route>
    ];

    const studentsURL = [
        <Route path="/assignments" key="/assignments" exact>
        <Layout>
            <AssignmentsPage />
        </Layout>
        </Route>,
        <Route path="/assignments/:id" key="/assignments/:id" exact>
            <Layout>
                <AssignmentsStudentPage />
            </Layout>
        </Route>
    ]

    const teacherUrls = [
        <Route path="/students" key="/students">
            <Layout>
                <StudentPage />
            </Layout>
        </Route>,
        <Route path="/risk-profiles" key="/risk-profiles" exact>
            <Layout>
                <RiskProfilePage />
            </Layout>
        </Route>,
        <Route path="/risk-profiles/:id" key="/risk-profiles/:id" exact>
            <Layout>
                <RiskProfileDetailPage />
            </Layout>
        </Route>,
        <Route path="/assignments" key="/assignments" exact>
            <Layout>
                <AssignmentsPage />
            </Layout>
        </Route>,
        <Route path="/assignments/:id" key="/assignments/:id" exact>
            <Layout>
                <AssignmentsStudentPage />
            </Layout>
        </Route>
    ]



    const authorizedUrls = [
        <Route path="/users" key="/users">
            <Layout>
                <Users />
            </Layout>
        </Route>,
        <Route path="/courses" key="/courses" exact>
            <Layout>
                <CoursePage />
            </Layout>
        </Route>,
        <Route path="/students" key="/students">
            <Layout>
                <StudentPage />
            </Layout>
        </Route>,
        <Route path="/courses/:courseId/students" key="courses/:courseId/students" exact>
            <Layout>
                <CourseStudentPage />
            </Layout>
        </Route>,
        <Route path="/risk-profiles" key="/risk-profiles" exact>
            <Layout>
                <RiskProfilePage />
            </Layout>
        </Route>,
        <Route path="/risk-profiles/:id" key="/risk-profiles/:id" exact>
            <Layout>
                <RiskProfileDetailPage />
            </Layout>
        </Route>,
         <Route path="/assignments" key="/assignments" exact>
            <Layout>
                <AssignmentsPage />
            </Layout>
        </Route>,
         <Route path="/assignments/:id" key="/assignments/:id" exact>
            <Layout>
                <AssignmentsStudentPage />
            </Layout>
        </Route>
    ];


    return (
        <React.Fragment>
            <HashRouter>
                <Switch>
                    <Route path="/" exact>
                        <Layout>
                            <Home />
                        </Layout>
                    </Route>
                    {unathorizedUrls}
                    {authCtx.isLoggedIn && role === "Student" && studentsURL}
                    {authCtx.isLoggedIn && role === "Teacher" && teacherUrls}
                    {authCtx.isLoggedIn && role !== "Student" && role !== "Teacher" && authorizedUrls}
                    <Route path="*">
                        <Layout>
                            <Redirect to={'/'} />
                        </Layout>
                    </Route>
                </Switch>
            </HashRouter>
        </React.Fragment>
    );
}
    
export default Routes;