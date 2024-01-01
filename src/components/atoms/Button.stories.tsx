import type {Meta, StoryObj} from '@storybook/react';

import Button from './Button';

const meta = {
  title: 'atoms/Button',
  component: Button,
} as Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultButton: Story = {
  args: {},
};
