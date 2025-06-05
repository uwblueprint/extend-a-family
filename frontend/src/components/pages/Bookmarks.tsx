import React from "react";

const BookmarksContent = () => {
  return (
    <div>
      <div>Currently under construction 🛠️</div>
    </div>
  );
};

const Bookmarks = (): React.ReactElement => {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Bookmarks Page</h1>
      <div style={{ height: "2rem" }} />
      <BookmarksContent />
    </div>
  );
};

export default Bookmarks;