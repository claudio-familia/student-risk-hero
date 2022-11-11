import './Button.scss';

const Button = props => {
    return (
        <button
            className="srhero__button"
            type={props.type ? props.type : 'button'}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
}

export default Button;