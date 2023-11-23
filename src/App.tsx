import React from "react";

import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { DataContextProvider } from "./context/DataValueProvider";
import { useProjects } from "./lib/react-query/queries";
import { DataParamsProvider } from "./context/DataParamsProvider";

function App() {
  const { data: buildings } = useProjects();
  const location = useLocation();

  return (
    <div
      className={
        "container flex items-center justify-center mx-auto my-auto h-screen"
      }
    >
      <div className={"bg-bg-300 rounded-md"}>
        <Header />
        <div className="border-t">
          <div className="">
            <div className="grid lg:grid-cols-5">
              <Sidebar buildings={buildings ?? []} />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8">
                  {location.pathname === "/" ? (
                    <div>To define</div>
                  ) : (
                    <DataParamsProvider>
                      <DataContextProvider>
                        <Outlet />
                      </DataContextProvider>
                    </DataParamsProvider>
                  )}
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
