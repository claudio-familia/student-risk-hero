import React from 'react';
import ReactDOM from 'react-dom';
import Button from '../Button/Button';
import './Modal.scss';

const Backdrop = () => <div className="srhero__backdrop" style={{zIndex: '10'}}></div>;

const ModalCard = (props) => {
    return (
    <div className="srhero__modal">
            <header className='srhero__modal--header'>
                <h2>{props.title}</h2>
            </header>
            <div className='srhero__modal--content'>
                {props.children}
            </div>
            <footer className='srhero__modal--actions'>
                <Button onClick={props.onCancel}>Cancel</Button>
            </footer>
        </div>
    );
}

const Modal = props => {
    return (
        <React.Fragment>
            {ReactDOM.createPortal(
                <Backdrop />,
                document.querySelector("#backdrop-root")
            )}
            {ReactDOM.createPortal(
                <ModalCard 
                    title={props.title}
                    onCancel={props.onCancel}
                >
                    {props.children}
                </ModalCard>,
                document.querySelector("#overlay-root")
            )}
        </React.Fragment>
    );
}

export default Modal;