import "./App.css";
import { ExampleDto } from "./api/example.dto";

const example: ExampleDto = {
  test: "testValue",
  other: 2,
};

function App() {
  return <div className="App">Hello world</div>;
}

export default App;
