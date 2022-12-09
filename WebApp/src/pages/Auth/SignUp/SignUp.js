import './SignUp.scss';
import Card from '../../../components/core/Card/Card';
import Input from '../../../components/core/Input/Input';
import Button from '../../../components/core/Button/Button';
import AuthService from '../../../services/AuthService';
import logo from '../../../logo.svg';
import readers from '../../../assets/images/readers.jpg';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Spinner from '../../../components/core/Layout/Spinner/Spinner';
import { SuccessAlert } from '../../../services/AlertService';

const SignUp = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState(
        {
            Username: '',
            Password: '',
            confirmPassword: '',
            Email: '',
            Firstname: '',
            Lastname: '',
            Gender: '',
            Role: '',
            errors: {
                Username: undefined,
                Email: undefined,
                Password: undefined,
                Firstname: undefined,
                Lastname: undefined,
                Gender: undefined,
                Role: undefined,
            }
        }
    );

    const onInputChange = (event, field) => {
        setState((prevState) => {
            const newState = {...prevState};
            newState[field] = event.target.value;
            return newState;
        });
    }

    const addValidation = (error, field) => {
        if(error.errors) {
            setState((prevState) => {
                const newState = {...prevState};
                const keys = Object.keys(error.errors)
                newState.errors[keys[0]] = error.errors[keys[0]][0];
                return newState;
            });
        }
        else if(error.toString().toLowerCase().indexOf(field.toString().toLowerCase()) > -1){
            setState((prevState) => {
                const newState = {...prevState};
                newState.errors[field] = error;
                return newState;
            });
        }
    }

    const returnToLogin = () => {
        history.push('/login')
    }

    const deleteErrors = () => {
        setState(prevState => {
            const newState = {...prevState};
            newState.errors = {
                Username: undefined,
                Email: undefined,
                Password: undefined,
                Firstname: undefined,
                Lastname: undefined,
                Gender: undefined,
                Role: undefined,
            }
            return newState;
        })
    }

    const onSignUp = (e) => {
        e.preventDefault();
        setLoading(true);
        deleteErrors();
        const data = {...state};
        delete data.errors;
        AuthService.signUp(data)
        .then(async response => {
            setLoading(false);
           if(response.status === 400 || response.status === 500) {
            const keys = Object.keys(state);
            const error = await response.json()
            console.log(error)
            for(let key of keys) {
                addValidation(error.toString(), key);
            }
           } else {
            SuccessAlert()
           }
        })
        .catch(e => {
            setLoading(false);
        });
    }

    return (
        <React.Fragment>
            {loading && <Spinner />}
            <div className="srhero__sign-up--container">
                <div className="card--container col-xs-12 col-md-8 col-lg-9">
                    <Card>
                        <form onSubmit={onSignUp}>
                            <div className='logo'>
                                <img src={logo} alt="logo" width={'200px'} />
                            </div>
                            <div className='content'>
                                <h1>SignUp form</h1>
                                <div className='row'>
                                    <div className='col-xs-3'>
                                        <img src={readers} alt="readers" className='readers' />
                                    </div>
                                    <div className='col-xs-9'>
                                        <div className='row'>
                                            <div className='col-xs-12'>
                                                <h2>Personal information</h2>
                                            </div>
                                            <div className='col-xs-12 col-md-6 col-lg-6'>
                                                <Input 
                                                    label="Firstname" 
                                                    value={state.Firstname} 
                                                    type="text" 
                                                    placeholder="Type your firstname"
                                                    error={state.errors.Firstname}
                                                    onChange={(e) => {onInputChange(e, 'Firstname')}} />
                                            </div>
                                            <div className='col-xs-12 col-md-6 col-lg-6'>
                                                <Input 
                                                    label="Lastname" 
                                                    value={state.Lastname} 
                                                    type="text" 
                                                    placeholder="Type your lastname"
                                                    error={state.errors.Lastname}
                                                    onChange={(e) => {onInputChange(e, 'Lastname')}} />
                                            </div>
                                            <div className='col-xs-12 col-md-6 col-lg-6'>
                                                <Input 
                                                    label="Gender" 
                                                    value={state.Gender} 
                                                    type="dropdown" 
                                                    placeholder="Select your gender"
                                                    error={state.errors.Role}
                                                    onChange={(e) => {onInputChange(e, 'Gender')}}>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                </Input>
                                            </div>
                                            <div className='col-xs-12 col-md-6 col-lg-6'>
                                                <Input 
                                                    label="Email" 
                                                    value={state.Email} 
                                                    type="email" 
                                                    placeholder="Type your email"
                                                    error={state.errors.Email}
                                                    onChange={(e) => {onInputChange(e, 'Email')}} />
                                            </div>
                                            <div className='col-xs-12'>
                                                <h2>User information</h2>
                                            </div>
                                            <div className='col-xs-12'>
                                                <Input 
                                                    label="Username" 
                                                    value={state.Username} 
                                                    type="text" 
                                                    placeholder="Type your username"
                                                    error={state.errors.Username}
                                                    onChange={(e) => {onInputChange(e, 'Username')}} />
                                            </div>
                                            <div className='col-xs-12'>
                                                <Input 
                                                    label="Role" 
                                                    value={state.Role} 
                                                    type="dropdown" 
                                                    placeholder="Select your role"
                                                    error={state.errors.Role}
                                                    onChange={(e) => {onInputChange(e, 'Role')}}>
                                                        <option value="Teacher">Teacher</option>
                                                        <option value="Counselor">Counselor</option>
                                                        <option value="Director">Director</option>
                                                </Input>
                                            </div>
                                            <div className='col-xs-12 col-md-6 col-lg-6'>
                                                <Input 
                                                    label="Password" 
                                                    value={state.Password} 
                                                    type="password" 
                                                    placeholder="Type your password"
                                                    error={state.errors.Password}
                                                    onChange={(e) => {onInputChange(e, 'Password')}} />
                                            </div>
                                            <div className='col-xs-12 col-md-6 col-lg-6'>
                                                <Input 
                                                    label="Confirm Password" 
                                                    value={state.confirmPassword} 
                                                    type="password" 
                                                    placeholder="Confirm your password"
                                                    error={state.errors.Password}
                                                    onChange={(e) => {onInputChange(e, 'confirmPassword')}} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='button-section col-xs-12'>
                                        <div className='row'>
                                            <div className='col-xs-6 col-xs-offset-3'>
                                                <Button type='submit'>Sign up</Button>
                                                <br />
                                                <Button type='click' onClick={returnToLogin}>Return to login</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </React.Fragment>
    );
}

export default SignUp;