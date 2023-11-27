import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { DBConfig } from "./db/DBConfig";
import { initDB } from "react-indexed-db-hook";

initDB(DBConfig);

ReactDOM.createRoot(document.getElementById('main')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
