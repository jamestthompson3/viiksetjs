import React from 'react'
import PropTypes from 'prop-types'

import { getX, getY } from '../../utils/dataUtils'
import { determineXScale, determineYScale } from '../../utils/chartUtils'
import { uniq } from 'lodash'
import moment from 'moment'

export const withStreamPropTypes = {
  streamData: PropTypes.object
}

export default function withStream(BaseComponent) {
  class WrappedComponent extends React.PureComponent {
    state = {
      data: null,
      yScale: null,
      xScale: null,
      yPoints: null
    }
    fromStream = (data, children, parentHeight, parentWidth, xKey, yKey, type, margin, persist) => {
      const width = parentWidth - margin.left - margin.right
      const height = parentHeight - margin.top - margin.bottom
      const xPoints = uniq(getX(data, xKey)).map(
        datum =>
          typeof datum === 'string' && moment(datum).isValid() ? moment(datum).toDate() : datum
      )
      const yPoints = getY(data, yKey)
      const yScale = determineYScale({ type, yPoints, height, margin })
      const xScale = determineXScale({ type, width, xPoints, margin })
      return this.setState(s => ({
        data: s.data.length <= persist ? [...s.data, data] : [...s.data.slice(1), data],
        yPoints,
        yScale,
        xScale
      }))
    }
    render() {
      return <BaseComponent fromStream={this.fromStream} {...this.state} {...this.props} />
    }
  }
  return WrappedComponent
}
