import React, { useState, useEffect, useContext } from "react";
import useHttp from "../../../hooks/use-http";
import Table from "../../../components/core/Table/Table";
import Spinner from "../../../components/core/Layout/Spinner/Spinner";
import { useHistory } from "react-router-dom";
import AuthContext from "../../../store/auth-context";
import AuthUtil from "../../../utils/auth";

const AssignmentStudent = () => {
    const router = useHistory() 
    const context = useContext(AuthContext);
    const session = AuthUtil.getTokenData(context.token);
    const courseId = session["http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid"];
    const [assignments, setAssignments] = useState([]);

    const http = useHttp();

    const edit = (id) => {
        router.push('/assignments/'+id)
    }
                

    const fetchData = async () => {   
        const response = await http.sendRequest({ url: 'assignments/course/'+courseId });

        if(response.ok) {
            const data = await response.json();
            setAssignments(data);
        }
    };

    
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);

    const header = ['Name', 'Description', 'Due Date', ''];
    const rows = ['name', 'description', 'dueDate', 'options'];

    return (
        <React.Fragment>
            {http.isLoading && <Spinner />}
            <div className="row">
                <div className="col-xs-6">
                    <h1>My assignments</h1>
                </div>
                <div className="col-xs-12">
                    <Table 
                        header={header} 
                        rows={rows} 
                        data={assignments}
                        editHandler={edit}
                        dateColumns={['dueDate']}
                        editName={"Ver"}
                    />
                </div>
            </div>
            
        </React.Fragment>
    );
}

export default AssignmentStudent;