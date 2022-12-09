import React, { useState, useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';

import Card from '../../../components/core/Card/Card';
import Input from '../../../components/core/Input/Input';
import Button from '../../../components/core/Button/Button';
import AuthService from '../../../services/AuthService';
import logo from '../../../logo.svg';
import login from '../../../assets/images/login.jpg';

import './Login.scss';
import AuthContext from '../../../store/auth-context';
import Spinner from '../../../components/core/Layout/Spinner/Spinner';

const Login = () => {
    const authCtx = useContext(AuthContext);
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState({
        Username: '',
        Password: '',
        errorPassword: undefined,
        errorUsername: undefined,
        error: undefined
    });

    const onInputUsernameChange = (event) => {
        setState((prevState) => {
            return {
                ...prevState,
                Username: event.target.value
            };
        });
    }

    const onInputPasswordChange = (event) => {
        setState((prevState) => {
            return {
                ...prevState,
                Password: event.target.value
            };
        });
    }
    const goToLanding = () => {
        history.push('/landing')
    }

    const onLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        AuthService.login(state.Username, state.Password)
        .then(data => {
            switch(data.status) {
                case 200:
                    data.json().then((token) => {
                        authCtx.login(token);
                        history.replace('/');
                    })
                  break;
                case 400:
                case 401:
                  addValidation(data)
                  break;
                default:
                  alert(data)
                  break;
            }
        }).catch(data => {
            setLoading(false);
            console.log(data)
        });
    }

    const addValidation = (data) => {
        data.json().then(error => {
            if(error.toString().indexOf('Username') > -1){
                setState((prevState) => {
                    return {
                        ...prevState,
                        errorUsername: error
                    };
                });
            }
            if(error.toString().indexOf('Password') > -1){
                setState((prevState) => {
                    return {
                        ...prevState,
                        errorPassword: error
                    };
                });
            }
            if(error.toString().indexOf('credentials') > -1){
                setState((prevState) => {
                    return {
                        ...prevState,
                        error: error
                    };
                });
            }
        })
    }

    return (
        <React.Fragment>
            {loading && <Spinner />}
            <div className="srhero__login--container">
                <div className="col-xs-12 col-md-8 col-lg-8">
                    <Card>
                        <form onSubmit={onLogin}>
                            <div className='logo'>
                                <img src={logo} alt="logo" width={'200px'} />
                            </div>
                            <h1>Login</h1>    
                            <div className='row'>
                                <div className='col-xs-3'>
                                    <img src={login} className='login' alt="login" />
                                </div>
                                <div className='col-xs-9'>
                                    <div className='content'>                        
                                        <Input 
                                            label="Username" 
                                            value={state.Username} 
                                            type="text" 
                                            placeholder="Type your user's name"
                                            error={state.errorUsername}
                                            onChange={onInputUsernameChange} />
                                        <Input 
                                            label="Password" 
                                            type="password" 
                                            placeholder="Type your user's password"
                                            error={state.errorPassword}
                                            value={state.Password}
                                            onChange={onInputPasswordChange} />                                
                                        {state.error && <span className='label-error'>{state.error}</span>}
                                        <Button type="submit">Login</Button>
                                        <br />
                                        <Button onClick={goToLanding}>Go to Landing page</Button>
                                        <Link to='/sign-up'>Registrarme</Link>
                                        <Link to='/forgot-password'>Olvide mi contraseña</Link>
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

export default Login;