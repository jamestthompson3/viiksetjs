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

const TooltipContainer = styled.div.attrs({
  style: ({ mouseY, mouseX, height, width }) => ({
    top: mouseY - height,
    left: mouseX + width / 2
  })
})`
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

class PieChart extends React.Component<Props> {
  static defaultProps = {
    determineOpacity: () => 0.5,
    tooltipRenderer: defaultPieTooltip,
    tooltipContent: defaultTooltipContent,
    innerRadius: 0,
    outerRadius: 0,
    margin: { top: 10, bottom: 10, left: 10, right: 10 }
  }

  mouseMove = ({ d: { data, centroid } }) => {
    const { updateTooltip } = this.props
    return updateTooltip({
      calculatedData: data,
      mouseX: centroid[0],
      mouseY: centroid[1],
      showTooltip: true
    })
  }

  mouseLeave = () =>
    this.props.updateTooltip({ calculatedData: null, showTooltip: false, x: null, yCoords: null })

  calcRadius = (width: number, height: number): number => Math.min(width, height) / 2

  render() {
    const {
      color,
      data,
      dataKey,
      labelKey,
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
      pieProps
    } = this.props
    return (
      <DataContext {...{ data, margin, dataKey }}>
        {({ width, height, data, size }) => (
          <div style={{ width: size.width, height: size.height }}>
            <svg width={width} height={height}>
              <Group top={height / 2} left={width / 2}>
                <StyledPie
                  data={data}
                  pieValue={d => get(d, dataKey)}
                  innerRadius={this.calcRadius(width, height) - innerRadius}
                  outerRadius={this.calcRadius(width, height) - outerRadius}
                  fill={color}
                  fillOpacity={({ data }) => determineOpacity(data)}
                  onMouseEnter={d => () => this.mouseMove({ d })}
                  onMouseLeave={() => this.mouseLeave}
                  centroid={(centroid, arc) => {
                    const [x, y] = centroid
                    const { data } = arc
                    return <Label x={x} y={y} labelText={get(data, labelKey)} />
                  }}
                  {...pieProps}
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
