import React from "react";

const NotAuthorized = (): React.ReactElement => {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Can&apos;t view this page since you don&apos;t have permission 🙁</h1>
    </div>
  );
};

export default NotAuthorized;
