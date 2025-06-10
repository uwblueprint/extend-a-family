import React from "react";

const HomeContent = () => {
  return (
    <div>
      <div>Currently under construction 🛠️</div>
    </div>
  );
};

const Home = (): React.ReactElement => {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Home Page</h1>
      <div style={{ height: "2rem" }} />
      <HomeContent />
    </div>
  );
};

export default Home;
