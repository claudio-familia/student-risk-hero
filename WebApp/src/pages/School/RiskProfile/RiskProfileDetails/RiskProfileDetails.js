import React, { useState, useEffect } from "react";
import Button from "../../../../components/core/Button/Button";
import Modal from "../../../../components/core/Modal/Modal";
import Card from "../../../../components/core/Card/Card";
import useHttp from "../../../../hooks/use-http";
import Spinner from "../../../../components/core/Layout/Spinner/Spinner";
import RiskProfileForm from '../RiskProfileForm/RiskProfileForm';
import checked from '../../../../assets/images/checked.png';
import unchecked from '../../../../assets/images/unchecked.png';
import IMAGE from '../../../../assets/images/jpg.png';
import EXCEL from '../../../../assets/images/xls.png';
import PDF from '../../../../assets/images/pdf.png';
import WORD from '../../../../assets/images/docs.png';
import Male from '../../../../assets/images/Student_Male.png';
import Female from '../../../../assets/images/Student_Female.png';
import '../RiskProfile.scss';
import { useHistory, useParams } from 'react-router-dom';
import { RISKS, STATES } from "../RiskProfileUtil";
import { SuccessAlert } from "../../../../services/AlertService";
import EntryForm from "../EntryForm/EntryForm";
import EvidenceForm from "../EvidenceForm/EvidenceForm";

const RiskProfileDetailPage = () => {
    const router = useHistory();
    const params = useParams();
    const api = "risk-profile";

    const [openForm, setOpenForm] = useState(false);
    const [openEntryForm, setOpenEntryForm] = useState(false);
    const [riskProfile, setRiskProfile] = useState(undefined);
    const [currentEntryId, setCurrentEntryId] = useState(undefined);

    const http = useHttp();

    const signHandler = async (signer) => {
        const response = await http.sendRequest(
            { url: `risk-profile/${params.id}/${signer}` },
            undefined,
            'POST'
        );

        if(response.ok){
            SuccessAlert("Operation successful", "The "+signer+" Approval was registered correctly");
            fetchData();
        }
    }

    const backHandler = () => {
        router.push('/risk-profiles');
    }

    const cancelHandler = () => {
        setOpenForm(false)
        setOpenEntryForm(false)
        fetchData();
    }

    const newEntryHandler= () => {
        setOpenEntryForm(true)
    }

    const newEvidenceHandler = () => {
        setOpenForm(true)
    }

    const closeHandler = async () => {
        const response = await http.sendRequest(
            { url: `risk-profile/${params.id}/closing` },
            undefined,
            'PATCH'
        );

        if(response.ok){
            SuccessAlert("Operation successful", "Profile have been moved to closing state, you need to make the last entry and tell the result");;
            fetchData();
        }
    }

    const getEvidenceImage = (type) => {
        switch(type) {
            case "PDF": 
                return PDF;
            case "WORD": 
                return WORD;
            case "EXCEL": 
                return EXCEL;
            default:
                return IMAGE;                
        }
    }

    const documentForm = <Modal 
                    title={"Evidence form"}
                    onCancel={cancelHandler}
                >
                    {riskProfile && <EvidenceForm riskProfileId={riskProfile.id} submit={cancelHandler} />}
                </Modal>

    const entryForm =  <Modal 
                        title={"Entry form"}
                        onCancel={cancelHandler}
                    >
                        {riskProfile && <EntryForm riskProfileId={riskProfile.id} isFinal={riskProfile.state === "Closing"} id={currentEntryId} submit={cancelHandler} />}
                    </Modal>


    const fetchData = async () => {   
        const response = await http.sendRequest({ url: api+'/'+params.id });

        if(response.ok) {
            const data = await response.json();
            setRiskProfile(data);
        }
    };
    
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [])


    return (
    <React.Fragment>
        {http.isLoading && <Spinner />}
        {!riskProfile ? <h1>Risk Profile not found</h1> : (
        <Card>
            {openForm && documentForm}
            {openEntryForm && entryForm}
            {http.isLoading && <Spinner />}
            <div className="row risk__profile__details">
                <div className="row line" style={{paddingLeft: '18px'}}>
                    <div className="col-xs-8">
                        <h1>Risk profile</h1>
                        <h3>{riskProfile.id}</h3>
                    </div>
                    <div className="col-xs-4 align-end">
                        <div style={{width: "200px" }}>
                            <Button onClick={backHandler}>
                                Atras
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="col-xs-12" style={{textAlign: 'right'}}>
                    <br />
                    <h1 className={`STATE__${riskProfile.state}`}>{STATES[riskProfile.state]}</h1>
                </div>
                <div className="col-xs-12">
                    <br />
                    <div className="entries line">
                        <h2 className="">Riesgo: <span>{RISKS[riskProfile.risk]}</span></h2>
                        {riskProfile.state === "InProgress" && <Button size="sm" onClick={closeHandler}>Cerrar perfil</Button>}
                    </div>
                    <div className="row" style={{display: 'flex', alignItems: 'center'}}>
                        <div className="col-xs-12 col-sm-6">
                            <p>
                                <b>Description:</b> {riskProfile.description}
                            </p>
                            <p>
                                <b>Created at:</b> {riskProfile.createdAt}
                            </p>
                            <p>
                                <b>Course:</b> {riskProfile.student.currentCourse.name}
                            </p>
                            <p>
                                <b>Teacher:</b> {riskProfile.student.currentCourse.teacher.firstname} {riskProfile.student.currentCourse.teacher.lastname}
                            </p>
                        </div>
                        <div className="col-xs-12 col-sm-6" style={{textAlign: 'center'}}>
                            <h1 style={{fontSize: '7rem'}}>89</h1>
                            <br />
                            <h3>Promedio academico</h3>
                        </div>
                    </div>
                </div>
                <div className="col-xs-12 student__information">
                    <h3 className="line">Student Information</h3>
                    <div className="row" style={{display: 'flex', alignItems: 'center'}}>
                        <div className="col-xs-12 col-sm-6 col-md-4" style={{textAlign: 'center'}}>
                            <img src={riskProfile.student.gender ===  "Male" ? Male : Female} alt={"Student"}  />
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-8">
                            <div className="row">
                                <div className="col-xs-12 col-sm-6">
                                    <p>
                                        <b>Nombre:</b> {riskProfile.student.firstname}
                                    </p>
                                    <p>
                                        <b>Apellido:</b> {riskProfile.student.lastname}
                                    </p>
                                    <p>
                                        <b>Edad:</b> {riskProfile.student.birthdate}
                                    </p>
                                    <p>
                                        <b>Gender:</b> {riskProfile.student.gender}
                                    </p>
                                </div>
                                <div className="col-xs-12 col-sm-6">
                                    <p>
                                        <b>Padre:</b> {riskProfile.student.fathersFullName}
                                    </p>
                                    <p>
                                        <b>Madre:</b> {riskProfile.student.mothersFullName}
                                    </p>
                                    <p>
                                        <b>Contacto 1:</b> {riskProfile.student.phoneNumber1}
                                    </p>
                                    <p>
                                        <b>Contacto 2:</b> {riskProfile.student.phoneNumber2}
                                    </p>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                </div>
                <div className="col-xs-12">
                    <br />
                    <h3 className="line">Authorization</h3>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="thead-risk">
                                <tr>
                                    <th>#</th>
                                    <th>Person</th>
                                    <th>Role</th>
                                    <th>Signed</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>1</th>
                                    <td>Robinson Remigio</td>
                                    <td>Director</td>
                                    <td className="state-img"><img alt="Closed" src={riskProfile.directorApproval ? checked : unchecked} /></td>
                                    <td style={{display: 'flex'}}>
                                        {riskProfile.directorApprovalDate ? riskProfile.directorApprovalDate.toString().split('T')[0] :
                                        <Button size="sm" onClick={() => {signHandler('Director')}}>Firmar</Button>}
                                    </td>
                                </tr>
                                <tr>
                                    <th>2</th>
                                    <td>{riskProfile.student.currentCourse.teacher.firstname} {riskProfile.student.currentCourse.teacher.lastname}</td>
                                    <td>Teacher</td>
                                    <td className="state-img"><img alt="Closed" src={riskProfile.teachersApproval ? checked : unchecked} /></td>
                                    <td style={{display: 'flex'}}>
                                        {riskProfile.teachersApprovalDate ? riskProfile.teachersApprovalDate.toString().split('T')[0] :
                                        <Button size="sm" onClick={() => {signHandler('Teacher')}}>Firmar</Button>}
                                    </td>
                                </tr>
                                <tr>
                                    <th>3</th>
                                    <td>{riskProfile.student.fathersFullName} <br /> {riskProfile.student.mothersFullName}</td>
                                    <td>Parents</td>
                                    <td className="state-img"><img alt="Closed" src={riskProfile.parentsApproval ? checked : unchecked} /></td>
                                    <td style={{display: 'flex'}}>
                                        {riskProfile.parentsApprovalDate ? riskProfile.parentsApprovalDate.toString().split('T')[0] :
                                            <Button size="sm" onClick={() => {signHandler('Parent')}}>Firmar</Button>
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-xs-12">
                    <br />
                    <div className="entries line">
                        <h3 className="">Evidence</h3>
                        {riskProfile.state !== "Closed" && <Button size="sm" onClick={newEvidenceHandler}>Subir evidencia</Button>}
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            {!riskProfile.evidences && <h3 style={{textAlign: 'center'}}>Risk profile does not have any evidence yet</h3>}
                            <div  className="row">
                                {riskProfile.evidences.map((item, idx) => (
                                    <div className="evidence col-xs-12 col-sm-6 col-md-4 col-lg-3" key={idx}>
                                        <a href={item.blobUrl} >
                                            <img alt={item.description} src={getEvidenceImage(item.type)} />
                                            <h4>{item.description}</h4>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xs-12">
                    <br />
                    <div className="entries line">
                        <h3>Entries</h3>
                        {riskProfile.state !== "Closed" && <Button size="sm" onClick={newEntryHandler}>
                            New entry
                        </Button>}
                    </div>
                </div>
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                            {!riskProfile.entries && <h3 style={{textAlign: 'center'}}>Risk profile does not have any evidence yet</h3>}
                            <div className="main-timeline7">
                                {riskProfile.entries.map((item, idx) => (
                                    <div className="timeline" key={idx}>
                                        <div className="timeline-icon">
                                            <i className="fa fa-book"></i>
                                        </div>
                                        <span className="year">{item.date.toString().replace('T', ' ').split('.')[0]}</span>
                                        <div className="timeline-content">
                                            <h5 className="title">{item.finding}</h5>
                                            <p className="description">
                                                {item.description}.
                                            </p>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )}
    </React.Fragment>
    )
}

export default RiskProfileDetailPage;
