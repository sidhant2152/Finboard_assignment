import React from 'react'
import { Widget } from '@/types/widget.types';

interface WidgetTableProps {
  widget: Widget;
}
const WidgetTable = ({ widget }: WidgetTableProps) => {
  return (
    <div>This is a table widget</div>
  )
}

export default WidgetTable