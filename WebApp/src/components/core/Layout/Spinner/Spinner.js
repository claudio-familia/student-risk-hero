import './Spinner.scss';
import React from 'react';
import ReactDOM from 'react-dom';


const Backdrop = () => <div className="srhero__backdrop"></div>;

const SpinnerElement = () => {
    return (
        <div className="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}

const Spinner = () => {
    return (
        <React.Fragment>
            {ReactDOM.createPortal(
                <Backdrop />,
                document.querySelector("#backdrop-root")
            )}
            {ReactDOM.createPortal(
                <SpinnerElement />,
                document.querySelector("#loading-root")
            )}
        </React.Fragment>
    );
}

export default Spinner;