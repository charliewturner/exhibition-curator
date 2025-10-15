import "./App.css";
import { useEffect, useState } from "react";
import Homepage from "./components/Homepage/Homepage";
import getAPI from "./components/getApi"
// import Profile from "./components/Profile/Profile";

function App(): React.JSX.Element {

    const [apiURL, setApiURL] = useState(
    "https://data.getty.edu/museum/collection/group/4d54a8e2-f16b-4784-92aa-2a2844ae63b1"
  );

  const [mainPageStatus, setMainPageStatus] = useState("loading");

useEffect(() => {
    const fetchAPI = async function () {
      setMainPageStatus("loading");
      try {
        // const url = topicFiltered ? apiURL + `?topic=${topicFiltered}` : apiURL;
        const data = await getAPI(apiURL);
        const { articles } = data;
      
        setMainPageStatus("success");
      } catch (err) {
        setMainPageStatus("error");
      }
    };

    fetchAPI();
  }, []);



  return (
    <>
      <Homepage></Homepage>
      {/* <Profile></Profile> */}
    </>
  );
}

export default App;
