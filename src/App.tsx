import React from "react";

import { Outlet } from "react-router-dom";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { useProjects } from "./hooks/useProjects";
import { DataContextProvider } from "./context/DataContextProvider";

function App() {
  const { buildings } = useProjects();

  return (
    <div
      className={
        "container flex items-center justify-center mx-auto my-auto h-screen"
      }
    >
      <div className={"h-3/4 bg-bg-300 rounded-md"}>
        <Header />
        <div className="border-t">
          <div className="">
            <div className="grid lg:grid-cols-5">
              <Sidebar buildings={buildings} />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8">
                  <DataContextProvider>
                    <Outlet />
                  </DataContextProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
