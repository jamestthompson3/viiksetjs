import React from 'react'
import PropTypes from 'prop-types'

export const withTooltipPropTypes = {
  tooltipData: PropTypes.object,
  updateTooltip: PropTypes.func,
  showTooltip: PropTypes.func,
  hideTooltip: PropTypes.func
}

export default function withTooltip(BaseComponent) {
  class WrappedComponent extends React.PureComponent {
    state = {
      calculatedData: null,
      yCoords: null,
      x: null,
      mouseX: null,
      mouseY: null
    }
    updateTooltip = ({ calculatedData, x, mouseX, yCoords, mouseY }) =>
      this.setState({ yCoords, calculatedData, x, mouseX, mouseY })

    render() {
      return <BaseComponent updateTooltip={this.updateTooltip} {...this.state} {...this.props} />
    }
  }
  return WrappedComponent
}
