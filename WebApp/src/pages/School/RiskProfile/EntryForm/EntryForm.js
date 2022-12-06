import useInput from "../../../../hooks/use-input";
import Input from "../../../../components/core/Input/Input";
import Button from "../../../../components/core/Button/Button";
import useHttp from "../../../../hooks/use-http";
import { SuccessAlert } from "../../../../services/AlertService";
import React, { useEffect, useState } from "react";
import Spinner from "../../../../components/core/Layout/Spinner/Spinner";

const EntryForm = (props) => {
    const [currentEntity, setCurrentEntity] = useState(undefined);

    const {
        value: finding,
        hasError: findingError,
        isValid: findingIsValid,
        setIsTouched: setFindingIsTouched,
        setValue: setFindingValue
    } = useInput(value => value.trim() !== '', 'The name input is required');

    const {
        value: description,
        hasError: descriptionError,
        setIsTouched: setDescriptionIsTouched,
        setValue: setDescriptionValue
    } = useInput();

    const {
        value: isClosingFinding,
        setIsTouched: setIsClosingFindingsTouched,
        setValue: setIsClosingFindingsValue,
    } = useInput();

    const http = useHttp();

    const fetchData = async () => {   
        const response = await http.sendRequest({ url: props.riskProfileId+'/entry/'+props.id });

        if(response.ok) {
            const data = await response.json();
            setCurrentEntity(data);
            setFindingValue({ target: { value: data.finding}});
            setDescriptionValue({ target: { value: data.description}});
        }
    };

    useEffect(() => {
        if(props.id) {
            fetchData();
        }
        // eslint-disable-next-line
    }, [])


    const formIsValid = findingIsValid;

    const submitHandler = (e) => {
        e.preventDefault();

        if (formIsValid) {
            if(props.id) {
                const data = {
                    ...currentEntity, 
                    finding, 
                    description,
                }

                http.sendRequest({ url: 'risk-profile/'+props.riskProfileId+'/entry' }, data, 'PUT').then(() => {
                    SuccessAlert('Operation completed', 'Entry have been updated successfully');
                    props.submit();
                });
            }else {
                let url = 'risk-profile/'+props.riskProfileId+'/entry'
                if(props.isFinal) {
                    url = 'risk-profile/'+props.riskProfileId
                }

                const data = {
                    finding, 
                    description
                }

                http.sendRequest({ url: url }, data, props.isFinal ? 'PATCH' : 'POST').then(() => {
                    SuccessAlert('Operation completed', 'Entry have been created successfully');
                    props.submit();
                });
            }
        } else {
            setFindingIsTouched(true);
            setDescriptionIsTouched(true);
        }
    }

    return (
        <React.Fragment>
            {http.isLoading && <Spinner />}
            <form className="row" onSubmit={submitHandler}>
                <div className="col-xs-12">
                    <Input 
                        label="Finding" 
                        value={finding} 
                        type="dropdown" 
                        placeholder="Select the Finding"
                        error={findingError}
                        onChange={setFindingValue}
                        onBlur={setFindingIsTouched}>
                            <option value="Consulta con consultor">Consulta con consultor</option>
                            <option value="Asignacion de proyecto">Asignacion de proyecto</option>
                            <option value="Comentario sobre progreso">Comentario sobre progreso</option>
                            <option value="Cita para pratica">Cita para pratica</option>
                    </Input>
                </div>
                <div className="col-xs-12">
                    <Input 
                        label="Description" 
                        value={description} 
                        type="long-text" 
                        placeholder="Type the description of the entry"
                        error={descriptionError}
                        onChange={setDescriptionValue}
                        onBlur={setDescriptionIsTouched} />
                </div>
                {props.isFinal && <div className="col-xs-12">
                    <label className="container__checkbox">Is Final Entry?
                        <input type="checkbox" value={isClosingFinding} checked onChange={setIsClosingFindingsValue} onBlur={setIsClosingFindingsTouched} />
                        <span className="checkmark"></span>
                    </label>
                </div>}
                <div className="col-xs-12">
                    <div style={{width: '150px'}}>
                        <Button type="submit">Submit</Button>
                    </div>
                </div>
            </form>
        </React.Fragment>
    );
}

export default EntryForm;