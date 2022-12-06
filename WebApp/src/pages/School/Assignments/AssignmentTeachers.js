import React, { useState, useEffect } from "react";
import Button from "../../../components/core/Button/Button";
import Modal from "../../../components/core/Modal/Modal";
import useHttp from "../../../hooks/use-http";
import Table from "../../../components/core/Table/Table";
import { ErrorAlert, QuestionAlert, SuccessAlert, InfoAlert } from '../../../services/AlertService';
import Spinner from "../../../components/core/Layout/Spinner/Spinner";
import AssignmentsTeacherForm from "./AssignmentsForm/AssignmentsTeacherForm";

const AssignmentTeacher = () => {
    const [openForm, setOpenForm] = useState(false);
    const [assignments, setAssignments] = useState([]);
    const [currentId, setCurrentId] = useState(undefined);

    const http = useHttp();

    const cancelHandler = () => {
        setOpenForm(false)
        fetchData();
    }

    const edit = (id) => {
        setCurrentId(id);
        setOpenForm(true);
    }

    const newHandler = () => {
        setOpenForm(true);
        setCurrentId(undefined);
    }

    const remove = (id) => {
        QuestionAlert().then(async (result) => {
            if (result.isConfirmed) {
                const response = await http.sendRequest({ url: 'assignments/'+id }, undefined, 'DELETE');
                if(response.ok){
                    SuccessAlert("Operation successful", "Assignment have been deleted");
                    fetchData();
                }
                else 
                    ErrorAlert("Error", "Assignment could not be deleted");
            } else if (result.isDenied) {
                InfoAlert("Prevented", "Assignment was not be deleted");
            }
        });
    }

    const form = <Modal 
                    title={"Assignment form"}
                    onCancel={cancelHandler}
                >
                    <AssignmentsTeacherForm id={currentId} submit={cancelHandler} />
                </Modal>
                

    const fetchData = async () => {   
        const response = await http.sendRequest({ url: 'assignments' });

        if(response.ok) {
            const data = await response.json();

            const dataToDisplay = data.map(i => {
                return {
                    ...i,
                    course: i.course.name
                }
            })
            setAssignments(dataToDisplay);
        }
    };

    
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);

    const header = ['Name', 'Description', 'Due Date', 'Course', ''];
    const rows = ['name', 'description', 'dueDate', 'course', 'options'];

    return (
        <React.Fragment>
            {http.isLoading && <Spinner />}
            {openForm && form}
            <div className="row">
                <div className="col-xs-6">
                    <h1>Assignments</h1>
                </div>
                <div className="col-xs-6 align-end">
                    <div style={{width: "200px" }}>
                        <Button onClick={newHandler}>
                            New Assigment
                        </Button>
                    </div>
                </div>
                <div className="col-xs-12">
                    <Table 
                        header={header} 
                        rows={rows} 
                        data={assignments}
                        dateColumns={['dueDate']}
                        editHandler={edit}
                        deleteHandler={remove}
                    />
                </div>
            </div>
            
        </React.Fragment>
    );
}

export default AssignmentTeacher;