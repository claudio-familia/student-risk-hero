import React, { useState, useEffect } from "react";
import Button from "../../../components/core/Button/Button";
import Modal from "../../../components/core/Modal/Modal";
import useHttp from "../../../hooks/use-http";
import Table from "../../../components/core/Table/Table";
import { ErrorAlert, QuestionAlert, SuccessAlert, InfoAlert } from '../../../services/AlertService';
import StudentForm from "./Form/StudentForm";
import Spinner from "../../../components/core/Layout/Spinner/Spinner";

const StudentPage = (props) => {
    const api = "students";
    const module = "Student";
    const header = ['Firstname', 'Lastname', 'Birthdate', 'Course', ''];
    const rows = ['firstname', 'lastname', 'birthdate', 'currentCourse', 'options'];

    const [openForm, setOpenForm] = useState(false);
    const [Students, setStudents] = useState([]);
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
                const response = await http.sendRequest({ url: `${api}/${id}` }, undefined, 'DELETE');
                if(response.ok){
                    SuccessAlert("Operation successful", module+" have been deleted");
                    fetchData();
                }
                else 
                    ErrorAlert("Error", module+" could not be deleted");
            } else if (result.isDenied) {
                InfoAlert("Prevented", module+" was not be deleted");
            }
        });
    }

    const form = <Modal 
                    title={module+" form"}
                    onCancel={cancelHandler}
                >
                    <StudentForm id={currentId} submit={cancelHandler} />
                </Modal>

    const fetchData = async () => {   
        const response = await http.sendRequest({ url: api });

        if(response.ok) {
            const data = await response.json();
            const dataToDisplay = data.map(i => {
                return {
                    ...i,
                    currentCourse: i.currentCourse.name
                }
            })
            setStudents(dataToDisplay);
        }
    };

    
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);

    return (
        <React.Fragment>
            {openForm && form}
            {http.isLoading && <Spinner />}
            <div className="row">
                <div className="col-xs-6">
                    <h1>{module}s</h1>
                </div>
                <div className="col-xs-6 align-end">
                    {props.hideNew ? null : <div style={{width: "200px" }}>
                        <Button onClick={newHandler}>
                            New {module}
                        </Button>
                    </div>}
                </div>
                <div className="col-xs-12">
                    <Table 
                        header={header} 
                        rows={rows} 
                        data={Students}
                        dateColumns={['birthdate']}
                        editHandler={props.select ? props.select : edit}
                        editName={props.select ? 'Select student' : 'Edit'}
                        deleteHandler={props.select ? undefined : remove}
                    />
                </div>
            </div>
            
        </React.Fragment>
    );
}

export default StudentPage;