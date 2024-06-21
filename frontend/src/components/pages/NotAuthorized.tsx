import React from "react";

const NotAuthorized = (): React.ReactElement => {
  return (
    <div style={{ textAlign: "center" }}>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <h1>Can't view this page since you don't have permission 🙁</h1>
    </div>
  );
};

export default NotAuthorized;
