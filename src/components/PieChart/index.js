import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Group } from '@vx/group'
import get from 'lodash/get'
import styled from 'styled-components'

import { StyledText, StyledPie, findColor, defaultTooltipContent } from '../styledComponents'
import withParentSize from '../Responsive/withParentSize'
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

class PieChart extends Component {
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

  render() {
    const {
      data,
      color,
      dataKey,
      size: { height, width },
      labelKey,
      determineOpacity,
      innerRadius,
      mouseY,
      mouseX,
      calculatedData,
      showTooltip,
      tooltipRenderer,
      tooltipContent,
      outerRadius,
      ...rest
    } = this.props
    const radius = Math.min(width, height) / 2
    return (
      <Fragment>
        <svg width={width} height={height}>
          <Group top={height / 2} left={width / 2}>
            <StyledPie
              data={data}
              pieValue={d => get(d, dataKey)}
              innerRadius={radius - innerRadius}
              outerRadius={radius - outerRadius}
              fill={color}
              fillOpacity={({ data }) => determineOpacity(data)}
              onMouseEnter={d => () => this.mouseMove({ d })}
              onMouseLeave={() => this.mouseLeave}
              centroid={(centroid, arc) => {
                const [x, y] = centroid
                const { data } = arc
                return <Label x={x} y={y} labelText={get(data, labelKey)} />
              }}
              {...rest}
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
      </Fragment>
    )
  }
}

PieChart.propTypes = {
  data: PropTypes.array.isRequired,
  color: PropTypes.string,
  /**
   * Prop for the key containing the label names
   */
  labelKey: PropTypes.string.isRequired,
  /**
   * Prop for the key containing the data
   */
  dataKey: PropTypes.string.isRequired,
  /**
   * Prop for determining the opacity of the pie pieces
   */
  determineOpacity: PropTypes.func,
  /**
   * innerRadius offset
   */
  innerRadius: PropTypes.number,
  /**
   * outerRadius offset
   */
  outerRadius: PropTypes.number
}

PieChart.defaultProps = {
  determineOpacity: () => 0.5,
  tooltipRenderer: defaultPieTooltip,
  tooltipContent: defaultTooltipContent,
  innerRadius: 0,
  outerRadius: 0,
  margin: { top: 10, bottom: 10, left: 10, right: 10 }
}

export default withTooltip(withParentSize(PieChart))
