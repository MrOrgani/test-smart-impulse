import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DataValueProvider } from './context/DataValueProvider';
import { useProjects } from './lib/react-query/queries';

export const App: React.FC = () => {
  const { data: buildings, isLoading } = useProjects();
  const location = useLocation();

  return (
    <div
      className={
        'flex-col xl:flex xl:flex-row items-center justify-center w-screen p-2 h-screen'
      }
    >
      <div className={'bg-white rounded-md'}>
        <Header />
        <div className="border-t">
          <div className="flex flex-col xl:flex xl:flex-row">
            <Sidebar buildings={buildings ?? []} isLoading={isLoading} />
            <div className="col-span-3 xl:col-span-4 xl:border-l">
              <div className="xl:w-[1000px] h-full xl:h-[780px] p-2 xl:px-8">
                {location.pathname === '/' ? (
                  <div className="flex h-full flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold tracking-tight">
                      Welcome,
                      <br />
                      please select a project (building)
                    </h1>
                  </div>
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
};

export default App;
