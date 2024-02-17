import { BrowserRouter } from "react-router-dom";

import './App.css';
import GlobalLayout from "./compents/GlobalLayout";

function App() {
  return (
    <div>
        <BrowserRouter>
            <GlobalLayout />
        </BrowserRouter>
    </div>
  );
}

export default App;
