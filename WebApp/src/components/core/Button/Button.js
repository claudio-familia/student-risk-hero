import './Button.scss';

const Button = props => {
    return (
        <button
            className={`srhero__button ${props.disabled ? 'srhero__button--disabled' : ''} ${props.size ? 'srhero__button--'+props.size : ''}`}
            type={props.type ? props.type : 'button'}
            disabled={props.disabled}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
}

export default Button;