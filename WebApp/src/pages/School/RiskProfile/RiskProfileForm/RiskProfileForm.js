import useInput from "../../../../hooks/use-input";
import Input from "../../../../components/core/Input/Input";
import Button from "../../../../components/core/Button/Button";
import useHttp from "../../../../hooks/use-http";
import { SuccessAlert } from "../../../../services/AlertService";
import React, { useEffect, useState } from "react";
import Spinner from "../../../../components/core/Layout/Spinner/Spinner";

const RiskProfileForm = (props) => {
    const api = "risk-profile";
    const module = "Risk profile";

    const [currentEntity, setCurrentEntity] = useState(undefined);
    const [students, setStudents] = useState([]);

    const {
        value: student,
        hasError: studentError,
        isValid: studentIsValid,
        setIsTouched: setStudentIsTouched,
        setValue: setStudentValue
    } = useInput(value => value.trim() !== '', 'The student input is required');

    const {
        value: risk,
        hasError: riskError,
        isValid: riskIsValid,
        setIsTouched: setRiskIsTouched,
        setValue: setRiskValue
    } = useInput(value => value.trim() !== '', 'The Risk input is required');

    const {
        value: description,
        hasError: descriptionError,
        setIsTouched: setDescriptionIsTouched,
        setValue: setDescriptionValue
    } = useInput();

    const http = useHttp();

    const fetchData = async (url) => {   
        const response = await http.sendRequest({ url: api+'/'+props.id });

        if(response.ok) {
            const data = await response.json();
            console.log(data)
            setCurrentEntity(data);
            setStudentValue({ target: { value: data.studentId}});
            setRiskValue({ target: { value: data.risk}});
            setDescriptionValue({ target: { value: data.description}});
        }
    };

    const fetchStudentsData = async () => {   
        const response = await http.sendRequest({ url: 'students' });

        if(response.ok) {
            const data = await response.json();
            setStudents(data);
        }
    };

    useEffect(() => {
        if(props.id) {
            fetchData();
        }
        fetchStudentsData();
        // eslint-disable-next-line
    }, [])


    const formIsValid = studentIsValid && riskIsValid;

    const submitHandler = (e) => {
        e.preventDefault();

        if (formIsValid) {
            if(props.id) {
                const data = {
                    ...currentEntity, 
                    risk: risk, 
                    description: description,
                }

                http.sendRequest({ url: api }, data, 'PUT').then(() => {
                    SuccessAlert('Operation completed', module+' have been updated successfully');
                    props.submit();
                });
            }else {
                const data = {
                    studentId: student,
                    risk: risk, 
                    description: description
                }

                http.sendRequest({ url: api }, data, 'POST').then(() => {
                    SuccessAlert('Operation completed', module+' have been created successfully');
                    props.submit();
                });
            }
        } else {
            setDescriptionIsTouched(true);
            setRiskIsTouched(true);
            setStudentIsTouched(true);
        }
    }

    return (
        <React.Fragment>
            {http.isLoading && <Spinner />}
            <form className="row" onSubmit={submitHandler}>
                <div className="col-xs-12">
                    <Input 
                        label="Student" 
                        value={student}
                        disabled={props.id} 
                        type="dropdown" 
                        placeholder="Select the student"
                        error={studentError}
                        onChange={setStudentValue}
                        onBlur={setStudentIsTouched}>
                            {students.map(res => {
                                return <option value={res.id}>{res.firstname} {res.lastname} - Curso: {res.currentCourse.name}</option>
                        })}
                    </Input>
                </div>
                <div className="col-xs-12">
                    <Input 
                        label="Risk" 
                        value={risk} 
                        type="dropdown" 
                        placeholder="Select the risk"
                        error={riskError}
                        onChange={setRiskValue}
                        onBlur={setRiskIsTouched}>
                            <option value="INASISTENCIA">Inasistencia excesiva</option>
                            <option value="DEFICIENCIA_ACADEMICA">Deficiencia academica</option>
                            <option value="MAL_COMPORTAMIENTO">Mal comportamiento</option>
                    </Input>
                </div>
                <div className="col-xs-12">
                    <Input 
                        label="Description" 
                        value={description} 
                        type="long-text" 
                        placeholder="Type the description of the case"
                        error={descriptionError}
                        onChange={setDescriptionValue}
                        onBlur={setDescriptionIsTouched} />
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

export default RiskProfileForm;