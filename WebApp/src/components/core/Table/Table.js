import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import Input from "../Input/Input";
import useInput from '../../../hooks/use-input';
import "./Table.scss";

const Table = (props) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(props.data);
        // eslint-disable-next-line
    }, [props.data]);

    const {
        value: search,
        hasError: searchError,
        setIsTouched: setsearchIsTouched,
        setValue: setsearchValue
    } = useInput();

    const thead = (
        <tr>
           {props.header.map(header => {
                let classes = header === '' ? 'option-th' : '';
                classes += props.thirdHandler ? ' third' : ''
                return <th className={classes}>{header}</th>
            })}
        </tr>
    );

    const changeHandler = (ev) => {
        const dataToDisplay = props.data.filter(item => {
            let canReturn = false;
            for(let attr of props.rows) {
                if(attr !== 'options' && item[attr].toString().toLowerCase().startsWith(ev.target.value.toLowerCase())){
                    canReturn = true;
                }
            }
            return canReturn;
        });
        setData(dataToDisplay);
        setsearchValue(ev)
    }

    const isDate = (key) => {
        return props.dateColumns ? props.dateColumns.indexOf(key) > -1 : false;
    }

    const tbody = (
        <React.Fragment>
           {data.map(body => {
                return (
                    <tr key={body["id"]}>
                        {props.rows.map(key => {
                            const row = key !== "options" ? <td>{isDate(key) ? body[key].toString().split('T')[0] : body[key]}</td> 
                                                          :  <td className="options">
                                                                {props.thirdHandler && <Button onClick={() => props.thirdHandler(body["id"])}>{props.thirdName}</Button>}
                                                                {props.editHandler && <Button onClick={() => props.editHandler(body["id"])}>{props.editName ? props.editName : 'Edit'}</Button>}
                                                                {props.deleteHandler && <Button onClick={() => props.deleteHandler(body["id"])}>Delete</Button>}
                                                            </td>;
                            return row;
                        })}
                    </tr>
                );
            })}
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <Input 
                label="Search" 
                value={search} 
                type="text" 
                error={searchError}
                onChange={changeHandler}
                onBlur={setsearchIsTouched}
                placeholder={'Type to search'}  />
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        {thead}
                    </thead>
                    <tbody>
                        {tbody}
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    );
}

export default Table;