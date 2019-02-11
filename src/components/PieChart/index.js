// @flow
import * as React from 'react'
import { Group } from '@vx/group'
import get from 'lodash/get'
import styled from 'styled-components'

import { StyledText, StyledPie, findColor, defaultTooltipContent } from '../styledComponents'
import DataContext from '../DataContext'
import withParentSize from '../Responsive/withParentSize'
import { type TooltipData } from '../ChartArea/index'
import { type RenderedChildProps } from '../../types/index'
import withTooltip from '../Tooltip/withTooltip'

const Label = ({ x, y, labelProps, labelText }) => (
  <StyledText x={x} y={y} {...labelProps}>
    {labelText}
  </StyledText>
)

Label.defaultProps = {
  labelProps: { fill: 'black', textAnchor: 'middle', dy: '.33em', fontSize: 10 }
}

const TooltipContainer = styled.div.attrs(p => ({
  style: {
    top: p.mouseY - p.height,
    left: p.mouseX + p.width / 2
  }
}))`
  display: flex;
  flex-direction: column;
  padding: 8px;
  position: relative;
  border-radius: 3px;
  background: #333;
  color: #fff;
  width: 200px;
  border: ${p => `2px solid ${findColor(p)}`};
  font-size: 12px;
  pointer-events: none;
`

const defaultPieTooltip = ({
  tooltipData,
  height,
  width,
  mouseX,
  mouseY,
  color,
  tooltipContent
}) => {
  return (
    <TooltipContainer {...{ mouseX, height, width, mouseY, color }}>
      {tooltipContent({ tooltipData })}
    </TooltipContainer>
  )
}

const PieBody = React.memo(function Pie({
  data,
  dataKey,
  width,
  height,
  innerRadius,
  outerRadius,
  pieProps,
  calcRadius,
  determineOpacity,
  mouseMove,
  mouseLeave,
  color,
  labelKey,
  labelProps
}) {
  return (
    <StyledPie
      data={data}
      pieValue={d => get(d, dataKey)}
      innerRadius={calcRadius(width, height) - innerRadius}
      outerRadius={calcRadius(width, height) - outerRadius}
      {...pieProps}
    >
      {pie =>
        pie.arcs.map((arc, i) => {
          const opacity = determineOpacity(arc.data)
          const [x, y] = pie.path.centroid(arc)
          const { startAngle, endAngle } = arc
          const hasSpaceForLabel = endAngle - startAngle >= 0.1
          return (
            <g
              key={`${arc.data.label}-${i}`}
              onMouseEnter={() => mouseMove({ arc, pie })}
              onMouseLeave={() => mouseLeave()}
            >
              <path d={pie.path(arc)} fill={color} fillOpacity={opacity} />
              {hasSpaceForLabel && (
                <Label x={x} y={y} labelText={get(arc.data, labelKey)} {...labelProps} />
              )}
            </g>
          )
        })
      }
    </StyledPie>
  )
})

function PieChart({
  color,
  data,
  dataKey,
  labelKey,
  labelProps,
  determineOpacity,
  margin,
  innerRadius,
  mouseY,
  mouseX,
  calculatedData,
  showTooltip,
  tooltipRenderer,
  tooltipContent,
  outerRadius,
  updateTooltip,
  pieProps
}): Props {
  const mouseMove = ({ arc, pie }) => {
    const { data } = arc
    const [x, y] = pie.path.centroid(arc)
    return updateTooltip({
      calculatedData: data,
      mouseX: x,
      mouseY: y,
      showTooltip: true
    })
  }

  const mouseLeave = () =>
    updateTooltip({ calculatedData: null, showTooltip: false, x: null, yCoords: null })

  const calcRadius = (width: number, height: number): number => Math.min(width, height) / 2

  return (
    <DataContext {...{ data, margin, dataKey }}>
      {({ width, height, data, size }) => (
        <div style={{ width: size.width, height: size.height }}>
          <svg width={width} height={height}>
            <Group top={height / 2} left={width / 2}>
              <PieBody
                {...{
                  data,
                  dataKey,
                  width,
                  height,
                  innerRadius,
                  outerRadius,
                  pieProps,
                  calcRadius,
                  determineOpacity,
                  mouseMove,
                  mouseLeave,
                  color,
                  labelKey,
                  labelProps
                }}
              />
            </Group>
          </svg>
          {showTooltip &&
            tooltipRenderer({
              ...{
                tooltipData: calculatedData,
                tooltipContent,
                mouseX,
                mouseY,
                height,
                color,
                width
              }
            })}
        </div>
      )}
    </DataContext>
  )
}

PieChart.defaultProps = {
  determineOpacity: () => 0.5,
  tooltipRenderer: defaultPieTooltip,
  tooltipContent: defaultTooltipContent,
  innerRadius: 0,
  outerRadius: 0,
  margin: { top: 10, bottom: 10, left: 10, right: 10 }
}

type Props = {
  labelKey: string,
  determineOpacity: any => number,
  mouseX: number,
  mouseY: number,
  tooltipRenderer: ($Shape<TooltipData>) => React.Node,
  tooltipContent: (tooltipData: Object) => React.Node,
  calculatedData: Object[],
  showTooltip: boolean,
  innerRadius: number,
  outerRadius: number,
  pieProps: Object,
  updateTooltip: ($Shape<TooltipData>) => mixed,
  ...RenderedChildProps
}

export default withTooltip(withParentSize(PieChart))
