import React from "react";
import "./TextBox.css";

const TextBox = ({ title, id, ...props }) => {
  return (
    <div className="text-box-container">
      <label htmlFor={id} className="text-box-title">
        {title}
      </label>
      <input
        id={id}
        type="text"
        className="text-box-input"
        {...props}
      />
    </div>
  );
};

export default TextBox;

