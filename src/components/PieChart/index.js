import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Pie } from '@vx/shape'
import { Group } from '@vx/group'
import { get } from 'lodash'
import styled from 'styled-components'

import { StyledText, findColor } from '../styledComponents'
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
const TooltipComponent = ({ tooltipData, height, width, mouseX, mouseY, color }) => {
  return (
    <TooltipContainer {...{ mouseX, height, width, mouseY, color }}>
      {Object.entries(tooltipData).map((entry, i) => <p key={i}>{`${entry[0]}: ${entry[1]}`}</p>)}
    </TooltipContainer>
  )
}

class PieChart extends Component {
  // shouldComponentUpdate(prevProps) {
  //   // return prevProps.data !== this.props.data || prevProps.dataKey !== this.props.dataKey
  //   // const widthWasChanged = prevProps.size && prevProps.size.width !== this.props.size.width
  //   // const heightWasChanged =
  //   //   prevProps.size.height !== 0 && prevProps.size.height !== this.props.size.height
  //   // if (dataWasChanged || widthWasChanged || heightWasChanged || dataKeyWasChanged) {
  //   //   return true
  //   // } else {
  //   //   return false
  //   // }
  // }
  mouseMove = ({ d: { data, centroid } }) => {
    const { updateTooltip } = this.props
    return updateTooltip({
      calculatedData: data,
      mouseX: centroid[0],
      mouseY: centroid[1]
    })
  }
  mouseLeave = () => this.props.updateTooltip({ calculatedData: null, x: null, yCoords: null })
  render() {
    const {
      data,
      color,
      dataKey,
      size: { height, width },
      labelKey,
      determineOpacity,
      innerRadius,
      margin,
      mouseY,
      mouseX,
      calculatedData,
      tooltip: Tooltip,
      outerRadius
    } = this.props
    const radius = Math.min(width, height) / 2
    return (
      <Fragment>
        <svg width={width} height={height}>
          <Group top={height / 2} left={width / 2}>
            <Pie
              data={data}
              pieValue={d => d[dataKey]}
              innerRadius={radius - innerRadius}
              outerRadius={radius - outerRadius}
              fill={color}
              fillOpacity={({ data }) => determineOpacity(data)}
              onMouseEnter={d => event => this.mouseMove({ d })}
              onMouseLeave={() => this.mouseLeave}
              centroid={(centroid, arc) => {
                const [x, y] = centroid
                const { data } = arc
                return <Label x={x} y={y} labelText={data[labelKey]} />
              }}
            />
          </Group>
        </svg>
        {mouseX && (
          <Tooltip tooltipData={calculatedData} {...{ mouseX, color, mouseY, height, width }} />
        )}
      </Fragment>
    )
  }
}

PieChart.propTypes = {
  data: PropTypes.array,
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
   * innerRadius offset
   */
  innerRadius: PropTypes.number,
  /**
   * outerRadius offset
   */
  outerRadius: PropTypes.number
}
PieChart.defaultProps = {
  determineOpacity: d => 0.5,
  tooltip: TooltipComponent,
  innerRadius: 0,
  outerRadius: 0,
  margin: { top: 10, bottom: 10, left: 10, right: 10 }
}
export default withTooltip(withParentSize(PieChart))
