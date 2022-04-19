import classes from '../styles/UI.module.css';

function Input(props) {
    return (
        <input
            className={ classes.input }
            { ...props }
        />
    );
}

export default Input;
