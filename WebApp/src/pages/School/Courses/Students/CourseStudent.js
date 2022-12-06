import React, { useState, useEffect } from "react";
import Button from "../../../../components/core/Button/Button";
import Modal from "../../../../components/core/Modal/Modal";
import useHttp from "../../../../hooks/use-http";
import Table from "../../../../components/core/Table/Table";
import { ErrorAlert, QuestionAlert, SuccessAlert, InfoAlert } from '../../../../services/AlertService';
import Spinner from "../../../../components/core/Layout/Spinner/Spinner";
import { useHistory, useParams } from "react-router-dom";
import StudentPage from "../../../Actors/Students/Students";

const CourseStudentPage = (props) => {
    const router = useHistory()
    const params = useParams();
    const [openForm, setOpenForm] = useState(false);
    const [students, setStudents] = useState([]);
    const [course, setCourse] = useState(undefined);
    const [currentId, setCurrentId] = useState(undefined);

    const http = useHttp();

    const cancelHandler = () => {
        setOpenForm(false)
        fetchData();
    }

    const newHandler = () => {
        setOpenForm(true);
        setCurrentId(undefined);
    }
    const goBackHandler = () => {
        router.push('/courses')
    }

    const remove = (id) => {
        QuestionAlert('Are you sure you want to remove this student?').then(async (result) => {
            if (result.isConfirmed) {
                const response = await http.sendRequest(
                { url: `courses/students` }, 
                { CourseId: params.courseId, StudentsId: [id]},
                'DELETE');
                if(response.ok){
                    SuccessAlert("Operation successful", "Student have been remove");
                    fetchData();
                }
                else 
                    ErrorAlert("Error", "Student could not be removed");
            } else if (result.isDenied) {
                InfoAlert("Prevented", "Student was not be removed");
            }
        });
    }

    const selectHandler = async (id) => {
        const response = await http.sendRequest(
            { url: `courses/students` }, 
            { CourseId: params.courseId, StudentsId: [id]}, 
            'POST');
        if(response.ok){
            SuccessAlert("Operation successful", "Student have been added");
            fetchData();
        }
        cancelHandler();
    }

    const form = <Modal 
                    title={"Student list"}
                    onCancel={cancelHandler}
                >
                    <StudentPage hideNew={true} select={selectHandler} />
                </Modal>
                

    const fetchData = async () => {   
        const response = await http.sendRequest({ url: `courses/${params.courseId}/students` });

        if(response.ok) {
            const data = await response.json();
            setCourse(data.course);
            setStudents(data.students.map(i => ({...i.student, id: i.id})));
        }
    };

    const courseInfo = course ? (
        <React.Fragment>
            <h2>{course.name}</h2>
            <h3>{course.school}</h3>
            <p>
                Start: {course.start.toString().split('T')[0]}
                <br />
                End: {course.end.toString().split('T')[0]}
            </p>
        </React.Fragment>
    ) : null;

    
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);

    const header = ['Firstname', 'Lastname', ''];
    const rows = ['firstname', 'lastname', 'options'];

    return (
        <React.Fragment>
            {http.isLoading && <Spinner />}
            {openForm && form}
            <div className="row">
                <div className="col-xs-6">
                    <h1>Students in course {currentId}</h1>
                </div>
                <div className="col-xs-6 align-end">
                    <div style={{width: "200px" }}>
                        <Button onClick={newHandler}>
                            Add student to course
                        </Button>
                    </div>
                    <div style={{width: "200px", marginLeft: '5px' }}>
                        <Button onClick={goBackHandler}>
                            Atras
                        </Button>
                    </div>
                </div>
                <div className="col-xs-12">
                    {course && courseInfo}
                </div>
                <div className="col-xs-12">
                    <Table 
                        header={header} 
                        rows={rows} 
                        data={students}
                        deleteHandler={remove}
                    >
                    </Table>
                </div>
            </div>
            
        </React.Fragment>
    );
}

export default CourseStudentPage;