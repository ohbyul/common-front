import React from 'react';

const ButtonBack = (props) => {
    return (
        <div className="display-flex display-gap16">
            <button type="button" className="btn-white"onClick={()=>history.back()}>{props.name}</button>
        </div>
    );
};

export default ButtonBack;