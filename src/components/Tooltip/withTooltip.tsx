import * as React from 'react'

interface Props {
  tooltipData: object;
  updateTooltip(arg: UpdaterProps): void;
}

interface UpdaterProps {
  calculatedData?: Object;
  x?: number;
  mouseX?: number;
  mouseY?: number;
  yCoords?: number[];
  showTooltip: boolean;
}

export default function withTooltip(BaseComponent: React.ReactNode) {
  class WrappedComponent extends React.PureComponent<Props, UpdaterProps> {
    state = {
      calculatedData: null,
      yCoords: null,
      x: null,
      mouseX: null,
      mouseY: null,
      showTooltip: false
    }

    updateTooltip = ({ calculatedData, x, mouseX, yCoords, mouseY, showTooltip }: UpdaterProps) =>
      this.setState({ yCoords, calculatedData, x, mouseX, mouseY, showTooltip })

    render() {
      return <BaseComponent updateTooltip={this.updateTooltip} {...this.state} {...this.props} />
    }
  }
  return WrappedComponent
}
