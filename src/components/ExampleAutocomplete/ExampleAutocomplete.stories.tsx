import type { Meta, StoryObj } from '@storybook/react'

import { ExampleAutocomplete } from './ExampleAutocomplete'

const meta = {
  title: 'Example/ExampleAutocomplete',
  component: ExampleAutocomplete,
  tags: ['autodocs'],
} satisfies Meta<typeof ExampleAutocomplete>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
