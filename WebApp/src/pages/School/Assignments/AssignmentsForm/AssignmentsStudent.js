import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import Card from "../../../../components/core/Card/Card";
import Button from "../../../../components/core/Button/Button";
import Input from "../../../../components/core/Input/Input";
import Spinner from "../../../../components/core/Layout/Spinner/Spinner";
import useHttp from "../../../../hooks/use-http";
import './AssignmentStudent.scss';
import ENV from "../../../../utils/env";
import { ErrorAlert, SuccessAlert } from "../../../../services/AlertService";
import AuthContext from "../../../../store/auth-context";
import AuthUtil from "../../../../utils/auth";
import IMAGE from '../../../../assets/images/jpg.png';
import EXCEL from '../../../../assets/images/xls.png';
import PDF from '../../../../assets/images/pdf.png';
import WORD from '../../../../assets/images/docs.png';

const AssignmentsStudentPage = () => {
    const inputFile = useRef();
    const params = useParams();
    const http = useHttp();
    const [assingment, setAssignment] = useState(undefined);
    const [submission, setSubmission] = useState(undefined);
    const context = useContext(AuthContext);
    const session = AuthUtil.getTokenData(context.token);
    const studentId = session["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid"];

    const fetchData = async () => {   
        const response = await http.sendRequest({ url: 'assignments/'+params.id });

        if(response.ok) {
            const data = await response.json();
            setAssignment(data);
        }
    };

    const checkSubmission =  async () => {   
        const response = await http.sendRequest({ url: 'assignments/student/'+params.id });

        if(response.ok) {
            const data = await response.json();
            setSubmission(data);
        }
    };

    
    useEffect(() => {
        fetchData();
        checkSubmission();
        // eslint-disable-next-line
    }, []);

    
    const submitHandler = (e) => {
        e.preventDefault();

        if (inputFile.current.files[0]) {
            const form = {
                AssignmentId: params.id, 
                StudentId: studentId
            }
            const file = inputFile.current.files[0];
            const data = new FormData();
            data.append("asset", file, file.name);
            data.append("homework", JSON.stringify(form))

            fetch(ENV.apiURL+'/assignments/submit-homework', {
                body: data,
                headers: {'Authorization': 'Bearer '+context.token},
                method: 'POST'
            }).then(() => {
                SuccessAlert('Operation completed', 'Homework have been submited successfully');
                inputFile.current.value = ''
            })
        } else {
            ErrorAlert('Operation failed', 'Homework cannot be submited without a file');
        }
    }

    
    const getEvidenceImage = (type) => {
        let res = null;
        if (type.indexOf('pdf') > -1) res = 'PDF'
        if (type.indexOf('xls') > -1) res = 'EXCEL'
        if (type.indexOf('docs') > -1) res = 'WORD'
        
        switch(res) {
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

    return (
        <React.Fragment>
            {http.isLoading && <Spinner />}
            {assingment && (
                <Card>
                    <form onSubmit={submitHandler} enctype="multipart/form-data">
                        <br />
                        <br />
                        <br />
                        <h1>Assignment: <span>{assingment.name}</span></h1>
                        <p className="description">
                            <b>Description:</b> {assingment.description}
                            <br />
                            <b>Due date:</b> {assingment.dueDate.toString().replace('T', ' ')}
                        </p>
                        <p>
                            <b>Subir tarea</b><br />
                            <label>Select the file</label>
                            <Input type={"file"} ref={inputFile} disabled={submission} />
                        </p>
                        {!submission && <p style={{display: 'flex', justifyContent: 'flex-end'}}>
                            <div style={{width: '150px', marginRight: '5px'}}>
                                <Button type="submit">Submit</Button>
                            </div>
                            <div style={{width: '150px'}}>
                                <Button type="button"  onClick={() => {inputFile.current.value = ''}}>Clear</Button>
                            </div>
                        </p>}
                        {submission && (
                            <div className="row">
                                <div className="evidence col-xs-12 col-sm-6">
                                    <a href={submission.blobUrl} >
                                        <img alt={submission.id} src={getEvidenceImage(submission.blobUrl)} />
                                        <h4>My {assingment.name}</h4>
                                    </a>
                                </div>
                                <div className="col-xs-12 col-sm-6">
                                    <h3 className="title">Veredicto</h3>
                                    <br />
                                    {submission.grade ? <h1>{submission.grade}</h1> : <h3>Sin corregir</h3>}
                                    {submission.comments ? <h2>{submission.comments}</h2> : <h3>Sin Comentarios</h3>}
                                </div>
                            </div>
                        )}
                    </form>
                </Card>
            )}
        </React.Fragment>
    );
}

export default AssignmentsStudentPage;