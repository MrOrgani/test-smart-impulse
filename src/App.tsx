import React from "react";

import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { DataValueProvider } from "./context/DataValueProvider";
import { useProjects } from "./lib/react-query/queries";
import { DataParamsProvider } from "./context/DataParamsProvider";

function App() {
  const { data: buildings, isLoading } = useProjects();
  const location = useLocation();

  return (
    <DataParamsProvider>
      <DataValueProvider>
        <div
          className={
            "container flex items-center justify-center mx-auto my-auto h-screen"
          }
        >
          <div className={"bg-white rounded-md"}>
            <Header />
            <div className="border-t">
              <div className="">
                <div className="flex">
                  <Sidebar buildings={buildings ?? []} isLoading={isLoading} />
                  <div className="col-span-3 lg:col-span-4 lg:border-l">
                    <div className="h-full px-4 py-6 lg:px-8">
                      {location.pathname === "/" ? (
                        <div>To define</div>
                      ) : (
                        <Outlet />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DataValueProvider>
    </DataParamsProvider>
  );
}

export default App;
