import { withNode } from '~/components/node/connector';
import { Button } from '../ui/button';
import { SettingsControl } from '../settings-control';

const draggable = true;

export const NodeButton = withNode(Button, {
  draggable,
});

NodeButton.craft = {
  ...NodeButton.craft,
  related: {
    toolbar: SettingsControl,
  },
};
