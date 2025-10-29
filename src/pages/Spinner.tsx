import React from "react";
import "../styles/Spinner.css"; // on stylise le spinner

const Spinner: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Spinner;
