import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import {DataBaseProvider} from "./contexts/DataBaseContext"

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <DataBaseProvider>
                <App />
            </DataBaseProvider>
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();