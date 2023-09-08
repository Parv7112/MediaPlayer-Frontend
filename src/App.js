import "bootstrap/dist/css/bootstrap.css";
import Routers from "./components/Router";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import store from './redux/store'; // Import your Redux store

const App = () => {

  return (
    <>
      <Routers />
    </>
  );
};

export default App;
