import React from 'react';
import './Input.scss';

export const Input = React.forwardRef((props,ref) => {
    let inputForm = (
        <input
            className={`srhero__input ${props.error ? 'srhero__input--error': ''}`}
            type={props.type}
            disabled={props.disabled}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
            onBlur={props.onBlur}
            ref={ref}
        />
    );

    if (props.type === "dropdown") {
        inputForm = (
            <select
                className={`srhero__input ${props.error ? 'srhero__input--error': ''}`}
                value={props.value}
                onChange={props.onChange}
                disabled={props.disabled}
                ref={ref}
            >
                <option value={undefined}>{props.placeholder}</option>
                {props.children}
            </select>
        );
    }

    if (props.type === "long-text") {
        inputForm = (
            <textarea
                className={`srhero__input ${props.error ? 'srhero__input--error': ''}`}
                type={props.type}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
                disabled={props.disabled}
                onBlur={props.onBlur}
                ref={ref}
            >
            </textarea>
        );
    }

    return (
        <div className='srhero__input--container'>
            {props.label && <label className='srhero__label'>{props.label}</label>}
            {inputForm}
            {props.error && <span className='srhero__input--error-label'>{props.error}</span>}
         </div>
    );
})

export default Input;