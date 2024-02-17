import { Drawer, DrawerContent, DrawerTrigger } from "~/components/ui/drawer";
import { Button } from "./ui/button";
import { CodeView } from "./code-view";
import { useEditor } from "@craftjs/core";
import { useState } from "react";
import { getOutputCode } from "~/lib/code-gen";

export const Viewport = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="viewport w-full overflow-y-auto overflow-x-hidden">
      <div className={"craftjs-renderer flex-1 h-full w-full"}>{children}</div>
    </div>
  );
};
