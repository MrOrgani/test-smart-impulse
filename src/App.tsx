import React from "react";

import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { DataValueProvider } from "./context/DataValueProvider";
import { useProjects } from "./lib/react-query/queries";

function App() {
  const { data: buildings, isLoading } = useProjects();
  const location = useLocation();

  return (
    <div
      className={
        "flex-col xl:flex xl:flex-row items-center justify-center w-screen p-2 h-screen"
      }
    >
      <div className={"bg-white rounded-md"}>
        <Header />
        <div className="border-t">
          <div className="flex flex-col xl:flex xl:flex-row">
            <Sidebar buildings={buildings ?? []} isLoading={isLoading} />
            <div className="col-span-3 xl:col-span-4 xl:border-l">
              <div className="h-full p-2 xl:px-8">
                {location.pathname === "/" ? (
                  <div>To define</div>
                ) : (
                  <DataValueProvider>
                    <Outlet />
                  </DataValueProvider>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
