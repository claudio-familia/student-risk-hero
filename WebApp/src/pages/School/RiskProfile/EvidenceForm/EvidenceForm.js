import useInput from "../../../../hooks/use-input";
import Input from "../../../../components/core/Input/Input";
import Button from "../../../../components/core/Button/Button";
import useHttp from "../../../../hooks/use-http";
import { SuccessAlert } from "../../../../services/AlertService";
import React, { useContext, useRef } from "react";
import Spinner from "../../../../components/core/Layout/Spinner/Spinner";
import ENV from "../../../../utils/env";
import AuthContext from "../../../../store/auth-context";

const EvidenceForm = (props) => {
    const inputFile = useRef();
    const ctx = useContext(AuthContext);
    const token= ctx.token;

    const {
        value: description,
        hasError: descriptionError,
        isValid: descriptionIsValid,
        setIsTouched: setDescriptionIsTouched,
        setValue: setDescriptionValue
    } = useInput(value => value.trim() !== '', 'The name input is required');

    const {
        value: type,
        hasError: typeError,
        setIsTouched: setTypeIsTouched,
        setValue: setTypeValue
    } = useInput();

    const http = useHttp();

    const formIsValid = descriptionIsValid;

    const submitHandler = (e) => {
        e.preventDefault();

        if (formIsValid) {
            const form = {
                Description: description, 
                Type: type
            }
            const file = inputFile.current.files[0];
            const data = new FormData();
            data.append("asset", file, file.name);
            data.append("Data", JSON.stringify(form))

            fetch(ENV.apiURL+'/risk-profile/'+props.riskProfileId+'/add/evidence', {
                body: data,
                headers: {
                  'Authorization': 'Bearer '+token   
                },
                method: 'POST'
            }).then(data => {
                SuccessAlert('Operation completed', 'Evidence have been created successfully');
                props.submit();
            })
        } else {
            setDescriptionIsTouched(true);
            setTypeIsTouched(true);
        }
    }

    return (
        <React.Fragment>
            {http.isLoading && <Spinner />}
            <form className="row" onSubmit={submitHandler} enctype="multipart/form-data">
                <div className="col-xs-12">
                    <label>Select the file</label>
                    <Input type={"file"} ref={inputFile} />
                </div>
                <div className="col-xs-12">
                    <Input 
                        label="Description of the evidence" 
                        value={description} 
                        type="dropdown" 
                        placeholder="Select the type of description for the evidence"
                        error={descriptionError}
                        onChange={setDescriptionValue}
                        onBlur={setDescriptionIsTouched}>
                            <option value="RECORD_NOTA">Record de notas</option>
                            <option value="REPORTE_ASISTENCIA">Reporte de asistencia</option>
                            <option value="IMAGEN_HECHO">Imagen de un hecho ocurrido</option>
                            <option value="LLAMADA_DE_ATENCION_FISICA">Llamada de atencion fisica</option>
                    </Input>
                </div>
                <div className="col-xs-12">
                    <Input 
                        label="Type of the evidence" 
                        value={type} 
                        type="dropdown" 
                        placeholder="Select the type of the document"
                        error={typeError}
                        onChange={setTypeValue}
                        onBlur={setTypeIsTouched} >
                            <option value="WORD">Documento de texto formato Word</option>
                            <option value="PDF">Documento de text formato PDF</option>
                            <option value="EXCEL">Documento de text formato EXCEL</option>
                            <option value="IMAGE">Documento de tipo imagen</option>
                    </Input>
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

export default EvidenceForm;