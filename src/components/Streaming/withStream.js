import React from 'react'
import PropTypes from 'prop-types'

import { getX, getY } from '../../utils/dataUtils'
import { determineXScale, determineYScale } from '../../utils/chartUtils'
import uniq from 'lodash/uniq'
import moment from 'moment'

export const withStreamPropTypes = {
  streamData: PropTypes.object
}

export default function withStream(BaseComponent) {
  class WrappedComponent extends React.PureComponent {
    state = {
      data: [],
      yScale: null,
      xScale: null,
      yPoints: null,
      chartData: false
    }

    fromStream = ({ message, mapStream, height, width, xKey, yKey, type, margin, persist }) => {
      const { data } = this.state
      const appendedData =
        mapStream(data, message).length <= persist
          ? mapStream(data, message)
          : mapStream(data, message).slice(1)
      const xPoints = uniq(getX(appendedData, xKey)).map(
        datum =>
          typeof datum === 'string' && moment(datum).isValid() ? moment(datum).toDate() : datum
      )
      const yPoints = getY(appendedData, yKey)
      const yScale = determineYScale({ type, yPoints, height, margin })
      const xScale = determineXScale({ type, width, xPoints, margin })
      return this.setState({
        data: appendedData,
        yPoints,
        yScale,
        xScale,
        chartData: true
      })
    }

    render() {
      return <BaseComponent fromStream={this.fromStream} {...this.state} {...this.props} />
    }
  }
  return WrappedComponent
}
