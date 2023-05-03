import { useEffect, useState } from "react";
import "./App.css";
import { ExampleDto } from "./api/example.dto";
import Spinner from "./components/Spinner/Spinner";

const example: ExampleDto = {
  test: "testValue",
  other: 2,
};

function App() {
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(()=>{
    const timeoutId = setTimeout(() => {
      setShowSpinner(false);
    }, 4000);

    return () => {
      clearTimeout(timeoutId);
    }
  }, [])

  return (
    <div className="App">
      <span className="hello-world">Hello world</span>{" "}
      <Spinner loadingMessage="Loading..." show={showSpinner} />
    </div>
  );
}

export default App;
