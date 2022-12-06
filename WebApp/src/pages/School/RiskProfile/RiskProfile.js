import React, { useState, useEffect } from "react";
import Button from "../../../components/core/Button/Button";
import Modal from "../../../components/core/Modal/Modal";
import useHttp from "../../../hooks/use-http";
import Spinner from "../../../components/core/Layout/Spinner/Spinner";
import RiskProfileForm from './RiskProfileForm/RiskProfileForm';
import checked from '../../../assets/images/checked.png';
import unchecked from '../../../assets/images/unchecked.png';
import './RiskProfile.scss';
import { useHistory } from "react-router-dom";

const RiskProfilePage = (props) => {
    const router = useHistory()
    const api = "risk-profile";
    const module = "Risk profile";

    const [openForm, setOpenForm] = useState(false);
    const [riskProfiles, setRiskProfiles] = useState([]);
    const [currentId, setCurrentId] = useState(undefined);

    const http = useHttp();

    const cancelHandler = () => {
        setOpenForm(false)
        fetchData();
    }

    const viewHandler = (id) => {
        setCurrentId(id);
        router.push('/risk-profiles/'+id)
    }

    const edit = (id) => {
        setCurrentId(id);
        setOpenForm(true);
    }

    const newHandler = () => {
        setOpenForm(true);
        setCurrentId(undefined);
    }

    const form = <Modal 
                    title={module+" form"}
                    onCancel={cancelHandler}
                >
                    <RiskProfileForm id={currentId} submit={cancelHandler} />
                </Modal>

    const fetchData = async () => {   
        const response = await http.sendRequest({ url: api });

        if(response.ok) {
            const data = await response.json();
            const dataToDisplay = data.map(i => {
                return {
                    ...i
                }
            })
            setRiskProfiles(dataToDisplay);
        }
    };

    
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);

    const checkState = (currentState, state) => {
        if  (
            (currentState === "Draft" && state === "Draft") ||
            (currentState === "Approved" && (state === "Draft" || state === "Approved")) ||
            (currentState === "InProgress" && (state === "Draft" || state === "Approved" || state === "InProgress")) ||
            (currentState === "Closing" && (state === "Draft" || state === "Approved" || state === "InProgress" || state === "closing")) ||
            currentState === "Closed"
        ) {
            return true
        } 
        
        return false
    }

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
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="thead-risk">
                                <tr>
                                    <th>#</th>
                                    <th>Risk</th>
                                    <th>Student</th>
                                    <th>Draft</th>
                                    <th>Approved</th>
                                    <th>In Progress</th>
                                    <th>Closing</th>
                                    <th>Closed</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {riskProfiles.map((rp, idx) => (
                                    <tr key={idx}>
                                        <th>{idx + 1}</th>
                                        <td>{rp.risk}</td>
                                        <td>{rp.student.firstname} {rp.student.lastname}</td>
                                        <td className="state-img"><img alt="Draft" src={checkState(rp.state, "Draft") ? checked : unchecked} /></td>
                                        <td className="state-img"><img alt="Approved" src={checkState(rp.state, "Approved") ? checked : unchecked} /></td>
                                        <td className="state-img"><img alt="InProgress" src={checkState(rp.state, "InProgress") ? checked : unchecked} /></td>
                                        <td className="state-img"><img alt="Closing" src={checkState(rp.state, "Closing") ? checked : unchecked} /></td>
                                        <td className="state-img"><img alt="Closed" src={checkState(rp.state, "Closed") ? checked : unchecked} /></td>
                                        <td style={{display: 'flex'}}>
                                            <Button style={{marginRight: '5px'}} onClick={() => {viewHandler(rp.id)}}>Ver</Button>
                                            {rp.state === "Draft" && <Button onClick={() => {edit(rp.id)}}>Editar</Button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
        </React.Fragment>
    );
}

export default RiskProfilePage;
