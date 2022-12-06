import useInput from "../../../../hooks/use-input";
import Input from "../../../../components/core/Input/Input";
import Button from "../../../../components/core/Button/Button";
import useHttp from "../../../../hooks/use-http";
import { SuccessAlert } from "../../../../services/AlertService";
import React, { useEffect, useState } from "react";
import Spinner from "../../../../components/core/Layout/Spinner/Spinner";

const AddStudentForm = (props) => {
}

const CourseForm = (props) => {
    const [currentEntity, setCurrentEntity] = useState(undefined);
    const [addStudentForm, setAddStudentForm] = useState(false);
    const [teachers, setTeachers] = useState([]);

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
        value: school,
        hasError: schoolError,
        isValid: schoolIsValid,
        setIsTouched: setSchoolIsTouched,
        setValue: setSchoolValue
    } = useInput();

    const {
        value: startDate,
        hasError: startDateError,
        isValid: startDateIsValid,
        setIsTouched: setStartDateIsTouched,
        setValue: setStartDateValue
    } = useInput(value => value.trim() !== '', 'The start date input is required');

    const {
        value: endDate,
        hasError: endDateError,
        isValid: endDateIsValid,
        setIsTouched: setEndDateIsTouched,
        setValue: setEndDateValue
    } = useInput(value => value.trim() !== '', 'The end date input is required');

    const {
        value: teacher,
        hasError: teacherError,
        isValid: teacherIsValid,
        setIsTouched: setTeacherIsTouched,
        setValue: setTeacherValue
    } = useInput(value => true, 'The teacher input is required');

    const http = useHttp();

    const fetchData = async () => {   
        const response = await http.sendRequest({ url: 'courses/'+props.id });

        if(response.ok) {
            const data = await response.json();
            setCurrentEntity(data);
            setNameValue({ target: { value: data.name}});
            setDescriptionValue({ target: { value: data.description}});
            setEndDateValue({ target: { value: data.end.split('T')[0]}});
            setSchoolValue({ target: { value: data.school}});
            setStartDateValue({ target: { value: data.start.split('T')[0]}});
            setTeacherValue({ target: { value: data.teacherId}});
        }
    };

    const feachTeacherData = async () => {   
        const response = await http.sendRequest({ url: 'teachers' });

        if(response.ok) {
            const data = await response.json();
            setTeachers(data)
        }
    };

    useEffect(() => {
        feachTeacherData();
        if(props.id) {
            fetchData();
        }
        // eslint-disable-next-line
    }, [])


    const formIsValid = nameIsValid && teacherIsValid && descriptionIsValid && startDateIsValid && endDateIsValid && schoolIsValid;

    const submitHandler = (e) => {
        e.preventDefault();

        if (formIsValid) {
            if(props.id) {
                const data = {
                    ...currentEntity, 
                    name, 
                    description,
                    school,
                    start: startDate,
                    end: endDate,
                    teacherId: teacher
                }

                http.sendRequest({ url: 'courses' }, data, 'PUT').then(() => {
                    SuccessAlert('Operation completed', 'Course have been updated successfully');
                    props.submit();
                });
            }else {
                const data = {
                    name, 
                    description,
                    school,
                    start: startDate,
                    end: endDate,
                    teacherId: teacher
                }

                http.sendRequest({ url: 'courses' }, data, 'POST').then(() => {
                    SuccessAlert('Operation completed', 'Course have been created successfully');
                    props.submit();
                });
            }
        } else {
            setNameIsTouched(true);
            setTeacherIsTouched(true);
            setEndDateIsTouched(true);
            setStartDateIsTouched(true);
        }
    }

    const addStudentHandler = () => {
        setAddStudentForm(true);
    }

    return (
        <React.Fragment>
            {http.isLoading && <Spinner />}
            {addStudentForm && <AddStudentForm />}
            <form className="row" onSubmit={submitHandler}>
                <div className="col-xs-12">
                    <div style={{width: "200px" }}>
                        <Button onClick={addStudentHandler}>
                            Add Students
                        </Button>
                    </div>
                </div>
                <div className="col-xs-12">
                    <Input 
                        label="Name" 
                        value={name} 
                        type="text" 
                        placeholder="Type your the course name"
                        error={nameError}
                        onChange={setNameValue}
                        onBlur={setNameIsTouched} />
                </div>
                <div className="col-xs-12">
                    <Input 
                        label="Description" 
                        value={description} 
                        type="text" 
                        placeholder="Type your the course description"
                        error={descriptionError}
                        onChange={setDescriptionValue}
                        onBlur={setDescriptionIsTouched} />
                </div>
                <div className="col-xs-12">
                    <Input 
                        label="School" 
                        value={school} 
                        type="text" 
                        placeholder="Type your the course's school name"
                        error={schoolError}
                        onChange={setSchoolValue}
                        onBlur={setSchoolIsTouched} />
                </div>
                <div className="col-xs-12">
                    <Input 
                        label="Teacher" 
                        value={teacher} 
                        type="dropdown" 
                        placeholder="Select the teacher"
                        error={teacherError}
                        onChange={setTeacherValue}
                        onBlur={setTeacherIsTouched}>
                        {teachers.map(res => {
                            return <option value={res.id}>{res.firstname} {res.lastname}</option>
                        })}
                    </Input>
                </div>
                <div className="col-xs-12">
                    <Input 
                        label="Start date" 
                        value={startDate} 
                        type="date" 
                        placeholder="Type your the course's start date"
                        error={startDateError}
                        onChange={setStartDateValue}
                        onBlur={setStartDateIsTouched} />
                </div>
                <div className="col-xs-12">
                    <Input 
                        label="End date" 
                        value={endDate} 
                        type="date" 
                        placeholder="Type your the course's end date"
                        error={endDateError}
                        onChange={setEndDateValue}
                        onBlur={setEndDateIsTouched} />
                </div>
                <div className="col-xs-12">
                    <div style={{width: '150px'}}>
                        <Button type="submit">Submit</Button>
                    </div>
                </div>
            </form>
        </React.Fragment>
    );
}

export default CourseForm;