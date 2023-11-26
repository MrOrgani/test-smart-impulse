import React from "react";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { QueryProvider } from "./lib/react-query/QueryProvider";

export const Root: React.FC = () => {
  return (
    <QueryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path=":uuid" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryProvider>
  );
};
