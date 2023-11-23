import { Building } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Link, useLocation } from "react-router-dom";

type IBuiding = {
  uuid: string;
  name: string;
  timezone: string;
};

export const Sidebar: React.FC<{ buildings: IBuiding[] }> = ({ buildings }) => {
  const location = useLocation();
  return (
    <div className="space-y-4 py-4">
      <div className="py-2">
        <h2 className="relative px-7 text-lg font-semibold tracking-tight">
          Batiments
        </h2>
        <ScrollArea className="h-[300px] px-1">
          <div className="space-y-1 p-2">
            {buildings?.map((building) => {
              const currentBuilding = location.pathname === "/" + building.uuid;
              return (
                <Link to={"/" + building.uuid} key={`${building.uuid}`}>
                  <Button
                    variant={currentBuilding ? "default" : "ghost"}
                    className="w-full justify-start font-normal"
                  >
                    <Building />
                    {building.name}
                  </Button>
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
