import React from "react";
import CreateForm from "../crud/CreateForm";
import MainPageButton from "../common/MainPageButton";

const CreatePage = (): React.ReactElement => {
  return (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      <h1>Welcome</h1>
      <div className="button-container">
          <button onClick={() => handleButtonClick('Button 1')}>Button 1</button>
          <button onClick={() => handleButtonClick('Button 2')}>Button 2</button>
          <button onClick={() => handleButtonClick('Button 3')}>Button 3</button>
        </div>
    </div>
  );
};

export default CreatePage;
