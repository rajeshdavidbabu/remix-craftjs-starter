import type { PropsWithChildren } from 'react';
import React, { forwardRef } from 'react';
import { useEditor, useNode } from '@craftjs/core';

const BUTTON_PATH = '@/components/button';
const CARD_PATH = '@/components/card';

const importPathMap: { [key: string]: string } = {
  button: BUTTON_PATH,
  card: CARD_PATH,
  cardheader: CARD_PATH,
  cardcontent: CARD_PATH,
  cardfooter: CARD_PATH,
  cardtitle: CARD_PATH,
  carddescription: CARD_PATH,
};

export const withNode = <T extends {}>(
  Component: React.ComponentType<T>,
  { draggable = true, droppable = true } = {}
) => {
  // Wrap the returned component with forwardRef
  const WithNode = forwardRef<HTMLElement, PropsWithChildren<T>>(
    (props, ref) => {
      const {
        id,
        connectors: { connect, drag },
      } = useNode();

      const { isActive } = useEditor((_, query) => ({
        isActive: query.getEvent('selected').contains(id),
      }));

      const applyRef = (node: HTMLElement) => {
        if (node) {
          if (draggable && droppable) {
            connect(drag(node));
          } else if (droppable) {
            connect(node);
          } else if (draggable) {
            drag(node);
          }
          // Forward the ref
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }
      };

      return (
        <Component
          ref={applyRef}
          {...props}
          className={
            isActive ? `${props.className} component-selected` : props.className
          }
        >
          {typeof props.children === 'string' &&
          props.children.trim() === '' ? (
            <>Empty text</>
          ) : (
            props.children || (
              <div className="text-center italic p-4 bg-yellow-100 outline-dashed outline-amber-400">
                Empty container
              </div>
            )
          )}
        </Component>
      );
    }
  );

  console.log('Component.displayName ', Component.displayName);

  WithNode.displayName = `WithNode(${Component.displayName})`;

  const importPathMapKey = Component.displayName?.toLowerCase();
  console.log(
    'importPathMapKey ',
    importPathMapKey,
    importPathMapKey && importPathMap[importPathMapKey]
  );

  WithNode.craft = {
    displayName: Component.displayName,
    custom: {
      importPath: importPathMapKey ? importPathMap[importPathMapKey] || '' : '',
    },
  };

  return WithNode;
};
