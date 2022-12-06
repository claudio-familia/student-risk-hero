import useInput from "../../../../hooks/use-input";
import Input from "../../../../components/core/Input/Input";
import Button from "../../../../components/core/Button/Button";
import useHttp from "../../../../hooks/use-http";
import { SuccessAlert } from "../../../../services/AlertService";
import React, { useEffect, useState } from "react";
import Spinner from "../../../../components/core/Layout/Spinner/Spinner";

const AssignmentsTeacherForm = (props) => {
    const [currentEntity, setCurrentEntity] = useState(undefined);
    const [courses, setCourses] = useState([]);
    const [submissions, setSubmissions] = useState([]);

    const {
        value: name,
        hasError: nameError,
        isValid: nameIsValid,
        setIsTouched: setNameIsTouched,
        setValue: setNameValue
    } = useInput(value => value.trim() !== '', 'The name input is required');

    const {
        value: description,
        hasError: descriptionError,
        isValid: descriptionIsValid,
        setIsTouched: setDescriptionIsTouched,
        setValue: setDescriptionValue
    } = useInput();

    const {
        value: dueDate,
        hasError: dueDateError,
        isValid: dueDateIsValid,
        setIsTouched: setDueDateIsTouched,
        setValue: setDueDateValue
    } = useInput(value => value.trim() !== '', 'The Due date input is required');


    const {
        value: course,
        hasError: courseError,
        isValid: courseIsValid,
        setIsTouched: setCourseIsTouched,
        setValue: setCourseValue
    } = useInput(value => value.trim() !== '', 'The Course input is required');

    const http = useHttp();

    const fetchData = async () => {   
        const response = await http.sendRequest({ url: 'assignments/'+props.id });

        if(response.ok) {
            const data = await response.json();
            setCurrentEntity(data);
            setSubmissions([...data.submissions]);
            setNameValue({ target: { value: data.name}});
            setDescriptionValue({ target: { value: data.description}});
            setDueDateValue({ target: { value: data.dueDate}});
            setCourseValue({ target: { value: data.courseId}});
        }
    };

    const feachCoursesData = async () => {   
        const response = await http.sendRequest({ url: 'courses' });

        if(response.ok) {
            const data = await response.json();
            setCourses(data)
        }
    };

    useEffect(() => {
        feachCoursesData();
        if(props.id) {
            fetchData();
        }
        // eslint-disable-next-line
    }, [])


    const formIsValid = nameIsValid && courseIsValid && descriptionIsValid && dueDateIsValid;

    const submitHandler = (e) => {
        e.preventDefault();

        if (formIsValid) {
            if(props.id) {
                const data = {
                    ...currentEntity, 
                    name, 
                    description,
                    dueDate: dueDate,
                    courseId: course
                }

                http.sendRequest({ url: 'assignments' }, data, 'PUT').then(() => {
                    SuccessAlert('Operation completed', 'Assignment have been updated successfully');
                    props.submit();
                });
            }else {
                const data = {
                    name, 
                    description,
                    dueDate: dueDate,
                    courseId: course
                }

                http.sendRequest({ url: 'assignments' }, data, 'POST').then(() => {
                    SuccessAlert('Operation completed', 'Assignment have been created successfully');
                    props.submit();
                });
            }
        } else {
            setNameIsTouched(true);
            setCourseIsTouched(true);
            setDueDateIsTouched(true);
        }
    }

    const submitGrade = (item) => {
        http.sendRequest({ url: 'assignments/grade/homework/student' }, item, 'POST').then(() => {
            SuccessAlert('Operation completed', 'Assignment have been created successfully');
            fetchData();
        });
    }

    return (
        <React.Fragment>
            {http.isLoading && <Spinner />}
            <form className="row" onSubmit={submitHandler}>
                <div className="col-xs-12">
                    <Input 
                        label="Name" 
                        value={name} 
                        type="text" 
                        placeholder="Type your the assingment name"
                        error={nameError}
                        onChange={setNameValue}
                        onBlur={setNameIsTouched} />
                </div>
                <div className="col-xs-12">
                    <Input 
                        label="Description" 
                        value={description} 
                        type="text" 
                        placeholder="Type your the assingment description"
                        error={descriptionError}
                        onChange={setDescriptionValue}
                        onBlur={setDescriptionIsTouched} />
                </div>
                <div className="col-xs-12">
                    <Input 
                        label="Due date" 
                        value={dueDate} 
                        type="datetime-local" 
                        placeholder="Type your the assingment's due date"
                        error={dueDateError}
                        onChange={setDueDateValue}
                        onBlur={setDueDateIsTouched} />
                </div>
                <div className="col-xs-12">
                    <Input 
                        label="Course" 
                        value={course} 
                        type="dropdown" 
                        placeholder="Select the Course"
                        error={courseError}
                        onChange={setCourseValue}
                        onBlur={setCourseIsTouched}>
                        {courses.map(res => {
                            return <option key={res.id} value={res.id}>{res.name}</option>
                        })}
                    </Input>
                </div>
                <div className="col-xs-12">
                    <div style={{width: '150px'}}>
                        <Button type="submit">Submit</Button>
                    </div>
                </div>
            </form>
            <div>
                <br />
                <h1>Grade assignment</h1>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead className="thead-risk">
                            <tr>
                                <th>Student</th>
                                <th>Grade</th>
                                <th>Comment</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map(item => (
                                <tr>
                                    <td>{item.student.firstname} {item.student.lastname}</td>
                                    <td><Input placeholder={"Type the grade"} type={"number"} value={item.grade} onChange={(e) => { item.grade = e.target.value }} /></td>
                                    <td><Input placeholder={"Type the Comment"} type={"text"} value={item.comments} onChange={(e) => { item.comments = e.target.value }}  /></td>
                                    <td style={{display: 'flex'}}>
                                        <Button size="sm" onClick={() => {submitGrade(item)}}>Submit</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </React.Fragment>
    );
}

export default AssignmentsTeacherForm;