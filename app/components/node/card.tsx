import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '../ui/card';
import { Element } from '@craftjs/core';
import { SettingsControl } from '../settings-control';
import { withNode } from './connector';
import { NodeButton } from './button';

interface NodeCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const draggable = true;
const droppable = true; // Can drop items into to this component

export const NodeCardHeader = withNode(CardHeader, {
  droppable,
});

export const NodeCardTitle = withNode(CardTitle, {
  draggable,
  droppable,
});

NodeCardTitle.craft = {
  ...NodeCardTitle.craft,
  related: {
    toolbar: SettingsControl,
  },
};

export const NodeCardDescription = withNode(CardDescription, {
  draggable,
  droppable,
});

NodeCardDescription.craft = {
  ...NodeCardDescription.craft,
  related: {
    toolbar: SettingsControl,
  },
};

export const NodeCardContent = withNode(CardContent, {
  droppable,
});

export const NodeCardFooter = withNode(CardFooter, {
  droppable,
});

export const NodeCardContainer = withNode(Card, {
  draggable,
  droppable,
});

export const NodeCard = ({ ...props }: NodeCardProps) => {
  return (
    <NodeCardContainer {...props}>
      <Element
        canvas
        id="card-header"
        is={NodeCardHeader as typeof NodeCardHeader & string}
      >
        <NodeCardTitle>Card Title</NodeCardTitle>
        <NodeCardDescription>Card Description</NodeCardDescription>
      </Element>
      <Element
        canvas
        id="card-content"
        is={NodeCardContent as typeof NodeCardContent & string}
      ></Element>
      <Element
        canvas
        id="card-footer"
        is={NodeCardFooter as typeof NodeCardFooter & string}
      >
        <NodeButton>Footer button</NodeButton>
      </Element>
    </NodeCardContainer>
  );
};

NodeCard.craft = {
  ...NodeCard.craft,
  displayName: 'Card',
  props: {
    className: 'p-6 m-2',
  },
  custom: {
    importPath: '@/components/card',
  },
  related: {
    toolbar: SettingsControl,
  },
};
