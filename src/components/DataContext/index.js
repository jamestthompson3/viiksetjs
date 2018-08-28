import { Component } from 'react'
import PropTypes from 'prop-types'
import uniq from 'lodash/uniq'
import isEmpty from 'lodash/isEmpty'

import { getX, getY, extractLabels, createScalarData } from '../../utils/dataUtils'
import { determineXScale, biaxial, determineYScale } from '../../utils/chartUtils'
import withParentSize from '../Responsive/withParentSize'

const margin = { top: 18, right: 15, bottom: 15, left: 30 }

class DataContext extends Component {
  state = {
    dataCalculated: false
  }

  componentDidMount() {
    this.calculateData()
  }

  componentDidUpdate(prevProps) {
    const dataWasChanged = prevProps.data !== this.props.data
    const widthWasChanged = prevProps.size && prevProps.size.width !== this.props.size.width
    const heightWasChanged =
      prevProps.size.height !== 0 && prevProps.size.height !== this.props.size.height
    const typeWasChanged = prevProps.type !== this.props.type

    if (dataWasChanged || widthWasChanged || heightWasChanged || typeWasChanged) {
      return this.calculateData()
    }
  }

  calculateData = () => {
    const { children, size, xKey, yKey, type, margin, data, orientation } = this.props

    if (isEmpty(data)) {
      // eslint-disable-next-line
      process.env.NODE_ENV !== 'production' && console.warn('Data is empty, cannot calculate chart')
      return null
    }

    const biaxialChildren = biaxial(children)
    const dataKeys = extractLabels(data[0])
    const width = size.width - margin.left - margin.right
    const height = size.height === 0 ? 300 : size.height - margin.top - margin.bottom
    const xPoints = uniq(getX(data, xKey))
    const yPoints = getY(data, yKey)
    const yScale = determineYScale({ type, yPoints, height, margin, orientation })
    const yScales = biaxialChildren && createScalarData(data, dataKeys, height, margin)
    const xScale = determineXScale({ type, width, xPoints, margin })
    return this.setState({
      width,
      height,
      xPoints,
      xScale,
      yScale,
      yPoints,
      biaxialChildren,
      yScales,
      dataKeys,
      dataCalculated: true
    })
  }

  render() {
    const {
      width,
      height,
      xScale,
      yScale,
      yScales,
      biaxialChildren,
      dataCalculated,
      dataKeys,
      yPoints,
      xPoints
    } = this.state
    const { data, children, size, type, orientation, xKey, yKey, margin } = this.props
    return (
      dataCalculated &&
      children({
        xScale,
        size,
        type,
        orientation,
        xKey,
        yKey,
        margin,
        dataKeys,
        biaxialChildren,
        data,
        width,
        height,
        yPoints,
        xPoints,
        yScale,
        yScales
      })
    )
  }
}

DataContext.propTypes = {
  data: PropTypes.array.isRequired,
  /*
   * A string indicating the type of scale the type should have, defaults to timeseries
   */
  type: PropTypes.oneOf(['ordinal', 'linear']),
  /**
   * A string indicating the orientation the context should have
   */
  orientation: PropTypes.oneOf(['horizontal']),
  /**
   * A string indicating which data values should be used to create the xScale
   */
  xKey: PropTypes.string,
  /**
   * A string indicating which data values should be used to create the yScale
   */
  yKey: PropTypes.string,

  /**
   * An optional prop for context margins
   */
  margin: PropTypes.object
}

DataContext.defaultProps = {
  data: [],
  margin: margin
}

export default withParentSize(DataContext)
