import React, { useState, useEffect } from "react";
import Button from "../../../components/core/Button/Button";
import Modal from "../../../components/core/Modal/Modal";
import CourseForm from "./CourseForm/CourseForm";
import useHttp from "../../../hooks/use-http";
import Table from "../../../components/core/Table/Table";
import { ErrorAlert, QuestionAlert, SuccessAlert, InfoAlert } from '../../../services/AlertService';
import Spinner from "../../../components/core/Layout/Spinner/Spinner";
import { useHistory } from "react-router-dom";

const CoursePage = () => {
    const router = useHistory()
    const [openForm, setOpenForm] = useState(false);
    const [courses, setCourses] = useState([]);
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
    const studentHandler = (id) => {
        router.push(`/courses/${id}/students`)
    }

    const remove = (id) => {
        QuestionAlert().then(async (result) => {
            if (result.isConfirmed) {
                const response = await http.sendRequest({ url: 'courses/'+id }, undefined, 'DELETE');
                if(response.ok){
                    SuccessAlert("Operation successful", "Course have been deleted");
                    fetchData();
                }
                else 
                    ErrorAlert("Error", "Course could not be deleted");
            } else if (result.isDenied) {
                InfoAlert("Prevented", "Course was not be deleted");
            }
        });
    }

    const form = <Modal 
                    title={"Course form"}
                    onCancel={cancelHandler}
                >
                    <CourseForm id={currentId} submit={cancelHandler} />
                </Modal>
                

    const fetchData = async () => {   
        const response = await http.sendRequest({ url: 'courses' });

        if(response.ok) {
            const data = await response.json();
            setCourses(data);
        }
    };

    
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);

    const header = ['School', 'Name', 'Description', 'Start', 'End', ''];
    const rows = ['school', 'name', 'description', 'start', 'end', 'options'];

    return (
        <React.Fragment>
            {http.isLoading && <Spinner />}
            {openForm && form}
            <div className="row">
                <div className="col-xs-6">
                    <h1>Courses</h1>
                </div>
                <div className="col-xs-6 align-end">
                    <div style={{width: "200px" }}>
                        <Button onClick={newHandler}>
                            New course
                        </Button>
                    </div>
                </div>
                <div className="col-xs-12">
                    <Table 
                        header={header} 
                        rows={rows} 
                        data={courses}
                        dateColumns={['start', 'end']}
                        editHandler={edit}
                        deleteHandler={remove}
                        thirdHandler={studentHandler}
                        thirdName={'View students'}
                    />
                </div>
            </div>
            
        </React.Fragment>
    );
}

export default CoursePage;