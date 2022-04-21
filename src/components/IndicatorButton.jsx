
function IndicatorButton({ value, onClick }) {
    return (
        <div
            className="indicator-button"
            onClick={ onClick }
        >
            { value }
        </div>
    );
}

export default IndicatorButton;
