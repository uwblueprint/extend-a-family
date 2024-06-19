import React from "react";

const NotAuthorized = (): React.ReactElement => {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Can&apost view this page since you don&apost have permission 🙁</h1>
    </div>
  );
};

export default NotAuthorized;
