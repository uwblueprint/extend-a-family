import React from "react";
import { useHistory } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_BACKEND_URL as string);
socket.on("connect", () => {
  console.log("connected");
});
socket.connect();

const Welcome = (): React.ReactElement => {
  const history = useHistory();

  const handleButtonClick = (selectedRole: string) => {
    history.push(`/login?role=${selectedRole}`);
  };

  return (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      <h1>Welcome</h1>
      <div className="button-container">
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => handleButtonClick("administrator")}
        >
          Administrator
        </button>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => handleButtonClick("facilitator")}
        >
          Facilitator
        </button>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => handleButtonClick("learner")}
        >
          Learner
        </button>
      </div>
    </div>
  );
};

export default Welcome;
