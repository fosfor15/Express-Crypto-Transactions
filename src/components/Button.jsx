import classes from '../styles/UI.module.css';

function Button({ value, onClick }) {
    return (
        <button
            className={ classes.button }
            onClick={ onClick }
        >
            { value }
        </button>
    );
}

export default Button;
