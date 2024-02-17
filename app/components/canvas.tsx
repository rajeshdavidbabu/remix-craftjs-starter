import { useEditor, useNode } from '@craftjs/core';
import { MonitorPlay, Smartphone, Code, Redo, Undo } from 'lucide-react';
import React, { useState } from 'react';
import { getOutputCode, getOutputHTMLFromId } from '~/lib/code-gen';
import { CodeView } from './code-view';
import { DrawerTrigger, DrawerContent, Drawer } from './ui/drawer';

type CanvasProps = {
  children: React.ReactNode;
};

export const Canvas = ({ children }: CanvasProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  const [canvasWidth, setCanvasWidth] = useState('w-[100%]');
  const { canUndo, canRedo, actions, query } = useEditor((state, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));
  const [output, setOutput] = useState<string | null>();
  const [htmlOutput, setHtmlOutput] = useState<string | null>();

  const generateCode = () => {
    const { importString, output } = getOutputCode(query.getNodes());

    console.log('printing ', importString, output);

    setOutput(`${importString}\n\n${output}`);
  };

  const generateHTML = () => {
    const htmlOutput = getOutputHTMLFromId('canvas-iframe');

    setHtmlOutput(htmlOutput);
  };

  const [open, setOpen] = useState(false);
  const [htmlOpen, setHtmlOpen] = useState(false);

  const handleIconClick = (newWidth: any) => {
    setCanvasWidth(newWidth);
  };

  return (
    <div className="w-full h-full flex justify-center">
      <div className={`${canvasWidth} flex flex-col h-full border rounded-sm`}>
        <div className="flex justify-between items-center p-4 w-full bg-gray-200">
          <div className="flex gap-3">
            <div className="h-3 w-3 rounded-full bg-red-400"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
            <div className="h-3 w-3 rounded-full bg-green-400"></div>
          </div>
          <div className="flex gap-2">
            <Drawer
              open={open}
              onOpenChange={(value: boolean) => {
                generateCode();
                setOpen(value);
              }}
            >
              <DrawerTrigger>
                <Code
                  size={24}
                  strokeWidth={1.75}
                  className="text-gray-500 hover:text-primary transition duration-300"
                />
              </DrawerTrigger>

              <DrawerContent className="h-[75vh]">
                <CodeView codeString={output as string} />
              </DrawerContent>
            </Drawer>
            {/* <Drawer
              open={htmlOpen}
              onOpenChange={(value: boolean) => {
                generateHTML();
                setHtmlOpen(value);
              }}
            >
              <DrawerTrigger>
                <FileCode2
                  size={24}
                  strokeWidth={1.75}
                  className="text-gray-500 hover:text-primary transition duration-300"
                />
              </DrawerTrigger>

              <DrawerContent className="h-[75vh]">
                <CodeView codeString={htmlOutput as string} />
              </DrawerContent>
            </Drawer> */}
          </div>

          <div className="flex items-center gap-2 opacity-80 active:text-primary">
            <div className="flex">
              <div className="w-8">
                {canUndo && (
                  <Undo
                    size={24}
                    strokeWidth={1.75}
                    className="text-gray-500 hover:text-primary transition duration-300"
                    onClick={(event) => {
                      actions.history.undo();
                    }}
                  />
                )}
              </div>
              <div className="w-8">
                {canRedo && (
                  <Redo
                    size={24}
                    strokeWidth={1.75}
                    className="text-gray-500 hover:text-primary transition duration-300"
                    onClick={(event) => {
                      actions.history.redo();
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className="w-full flex-1 bg-white rounded-b-lg"
          ref={(ref) => {
            if (ref) {
              connect(drag(ref));
            }
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

Canvas.craft = {
  displayName: 'div',
  props: {
    className: 'w-full h-full',
  },
};
