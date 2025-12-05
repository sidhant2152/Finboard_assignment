import type { Widget } from '@/types/widget.types';
import React from 'react'

interface WidgetChartProps {
  widget: Widget;
}
const WidgetChart = ({ widget }: WidgetChartProps) => {
  return (
    <div>This is a chart widget</div>
  )
}

export default WidgetChart