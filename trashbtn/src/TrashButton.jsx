import { useState } from "react";
import "./style.css";

const TrashButton = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleClick = () => {
    setIsDeleting(true);
    // simulate async action
    setTimeout(() => {
      setIsDeleting(false);
      setIsDeleted(true);
      setTimeout(() => {
        setIsDeleted(false);
      }, 1250);
    }, 2500);
  };

  return (
    <div className="page">
      <button
        onClick={handleClick}
        className={`delete-button ${isDeleting || isDeleted ? "deleting" : ""}`}
        disabled={isDeleting || isDeleted}
      >
        <span className="button-text">
          {isDeleting || isDeleted ? "Deleting" : "Delete"}
        </span>
        <span className="animation">
          <span className="balls"></span>
          <span className="lid"></span>
          <span className="can">
            <span className="filler"></span>
          </span>
        </span>
      </button>
    </div>
  );
};

export default TrashButton;
