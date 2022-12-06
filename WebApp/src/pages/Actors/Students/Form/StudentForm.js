import useInput from "../../../../hooks/use-input";
import Input from "../../../../components/core/Input/Input";
import Button from "../../../../components/core/Button/Button";
import useHttp from "../../../../hooks/use-http";
import { SuccessAlert } from "../../../../services/AlertService";
import React, { useEffect, useState } from "react";
import Spinner from "../../../../components/core/Layout/Spinner/Spinner";

const StudentForm = (props) => {
    const api = "students";
    const module = "Student";

    const [currentEntity, setCurrentEntity] = useState(undefined);
    const [courses, setCourses] = useState([]);

    const {
        value: name,
        hasError: nameError,
        isValid: nameIsValid,
        setIsTouched: setNameIsTouched,
        setValue: setNameValue
    } = useInput(value => value.trim() !== '', 'The firstname input is required');

    const {
        value: lastname,
        hasError: lastnameError,
        isValid: lastnameIsValid,
        setIsTouched: setlastnameIsTouched,
        setValue: setlastnameValue
    } = useInput(value => value.trim() !== '', 'The lastname input is required');

    const {
        value: birthdate,
        hasError: birthdateError,
        isValid: birthdateIsValid,
        setIsTouched: setbirthdateIsTouched,
        setValue: setbirthdateValue
    } = useInput(value => value.trim() !== '', 'The birthdate input is required');

    const {
        value: gender,
        hasError: genderError,
        isValid: genderIsValid,
        setIsTouched: setgenderIsTouched,
        setValue: setgenderValue
    } = useInput(value => value.trim() !== '', 'The gender input is required');

    const {
        value: course,
        hasError: courseError,
        isValid: courseIsValid,
        setIsTouched: setcourseIsTouched,
        setValue: setcourseValue
    } = useInput(value => value.trim() !== '', 'The course is required');

    const {
        value: mothersFullName,
        hasError: mothersFullNameError,
        isValid: mothersFullNameIsValid,
        setIsTouched: setMothersFullNameIsTouched,
        setValue: setMothersFullNameValue
    } = useInput(value => value.trim() !== '', 'The fathers input is required');

    const {
        value: fathersFullName,
        hasError: fathersFullNameError,
        isValid: fathersFullNameIsValid,
        setIsTouched: setFathersFullNameIsTouched,
        setValue: setFathersFullNameValue
    } = useInput(value => value.trim() !== '', 'The mothers input is required');

    const {
        value: phoneNumber1,
        hasError: phoneNumber1Error,
        setIsTouched: setPhoneNumber1IsTouched,
        setValue: setPhoneNumber1Value
    } = useInput();

    const {
        value: phoneNumber2,
        hasError: phoneNumber2Error,
        setIsTouched: setPhoneNumber2IsTouched,
        setValue: setPhoneNumber2Value
    } = useInput();

    const http = useHttp();

    const fetchData = async (url) => {   
        const response = await http.sendRequest({ url: api+'/'+props.id });

        if(response.ok) {
            const data = await response.json();
            setCurrentEntity(data);
            setNameValue({ target: { value: data.firstname}});
            setlastnameValue({ target: { value: data.lastname}});
            setbirthdateValue({ target: { value: data.birthdate.split('T')[0]}});
            setcourseValue({ target: { value: data.course}});
            setgenderValue({ target: { value: data.gender}});
            setFathersFullNameValue({ target: { value: data.fathersFullName}});
            setMothersFullNameValue({ target: { value: data.mothersFullName}});
            setPhoneNumber1Value({ target: { value: data.phoneNumber1}});
            setPhoneNumber2Value({ target: { value: data.phoneNumber2}});
        }
    };

    const fetchCoursesData = async () => {   
        const response = await http.sendRequest({ url: 'courses' });

        if(response.ok) {
            const data = await response.json();
            setCourses(data);
        }
    };

    useEffect(() => {
        if(props.id) {
            fetchData();
        }
        fetchCoursesData();
        // eslint-disable-next-line
    }, [])


    const formIsValid = nameIsValid && genderIsValid && 
                        lastnameIsValid && birthdateIsValid && 
                        courseIsValid && fathersFullNameIsValid &&
                        mothersFullNameIsValid;

    const submitHandler = (e) => {
        e.preventDefault();

        if (formIsValid) {
            if(props.id) {
                const data = {
                    ...currentEntity, 
                    firstname: name, 
                    lastname: lastname,
                    course: course,
                    birthdate: birthdate,
                    gender: gender,
                    fathersFullName: fathersFullName,
                    mothersFullName: mothersFullName,
                    phoneNumber1: phoneNumber1,
                    phoneNumber2: phoneNumber2
                }

                http.sendRequest({ url: api }, data, 'PUT').then(() => {
                    SuccessAlert('Operation completed', module+' have been updated successfully');
                    props.submit();
                });
            }else {
                const data = {
                    firstname: name, 
                    lastname: lastname,
                    course: course,
                    birthdate: birthdate,
                    gender: gender,
                    fathersFullName: fathersFullName,
                    mothersFullName: mothersFullName,
                    phoneNumber1: phoneNumber1,
                    phoneNumber2: phoneNumber2,
                    profilePicture: ''
                }

                http.sendRequest({ url: api }, data, 'POST').then(() => {
                    SuccessAlert('Operation completed', module+' have been created successfully');
                    props.submit();
                });
            }
        } else {
            setNameIsTouched(true);
            setbirthdateIsTouched(true);
            setcourseIsTouched(true);
            setlastnameIsTouched(true);
            setFathersFullNameIsTouched(true);
            setMothersFullNameIsTouched(true);
        }
    }

    return (
        <React.Fragment>
            {http.isLoading && <Spinner />}
            <form className="row" onSubmit={submitHandler}>
                <div className="col-xs-12">
                    <Input 
                        label="Firstname" 
                        value={name} 
                        type="text" 
                        placeholder="Type your the firstname"
                        error={nameError}
                        onChange={setNameValue}
                        onBlur={setNameIsTouched} />
                </div>
                <div className="col-xs-12">
                    <Input 
                        label="Lastname" 
                        value={lastname} 
                        type="text" 
                        placeholder="Type your the lastname"
                        error={lastnameError}
                        onChange={setlastnameValue}
                        onBlur={setlastnameIsTouched} />
                </div>
                <div className="col-xs-12">
                    <Input 
                        label="Course" 
                        value={course} 
                        type="dropdown" 
                        placeholder="Select your the course"
                        error={courseError}
                        onChange={setcourseValue}
                        onBlur={setcourseIsTouched}>
                        {courses.map(res => {
                            return <option value={res.id}>{res.name}</option>
                        })}
                    </Input>
                </div>
                <div className="col-xs-12">
                    <Input 
                        label="Gender" 
                        value={gender} 
                        type="dropdown" 
                        placeholder="Select your gender"
                        error={genderError}
                        onChange={setgenderValue}
                        onBlur={setgenderIsTouched}>
                        <option value={'Male'}>{'Male'}</option>
                        <option value={'Female'}>{'Female'}</option>
                    </Input>
                </div>
                <div className="col-xs-12">
                    <Input 
                        label="Birthdate" 
                        value={birthdate} 
                        type="date" 
                        placeholder="Type your the Birthdate"
                        error={birthdateError}
                        onChange={setbirthdateValue}
                        onBlur={setbirthdateIsTouched} />
                </div>
                <div className="col-xs-12">
                    <Input 
                        label="Father" 
                        value={fathersFullName} 
                        type="text" 
                        placeholder="Type the father's full name"
                        error={fathersFullNameError}
                        onChange={setFathersFullNameValue}
                        onBlur={setFathersFullNameIsTouched} />
                </div>
                <div className="col-xs-12">
                    <Input 
                        label="Mother" 
                        value={mothersFullName} 
                        type="text"
                        placeholder="Type the mother's full name"
                        error={mothersFullNameError}
                        onChange={setMothersFullNameValue}
                        onBlur={setMothersFullNameIsTouched} />
                </div>
                <div className="col-xs-12">
                    <Input 
                        label="Phonenumber 1" 
                        value={phoneNumber1} 
                        type="text" 
                        placeholder="Type the phone number 1"
                        error={phoneNumber1Error}
                        onChange={setPhoneNumber1Value}
                        onBlur={setPhoneNumber1IsTouched} />
                </div>
                <div className="col-xs-12">
                    <Input 
                        label="Phonenumber 2" 
                        value={phoneNumber2} 
                        type="text" 
                        placeholder="Type the phone number 2"
                        error={phoneNumber2Error}
                        onChange={setPhoneNumber2Value}
                        onBlur={setPhoneNumber2IsTouched} />
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

export default StudentForm;