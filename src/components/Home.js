import React from "react";
import Header from "./Header";
import "../App.css";
import useDocumentTitle from "./hooks/useDocumentTitle";
import Footer from "./Footer";
import SearchProtein from "./SearchProtein";
const Home = () => {
  useDocumentTitle('Home [bat-studio]')
  return (
    <div>
      <Header />
       
        <div className="searchProtein">
          <SearchProtein/>
        </div>
      <Footer/>
    </div>
  );
};

export default Home;
