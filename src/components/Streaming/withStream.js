import React from 'react'

export default function withStream(BaseComponent) {
  class WrappedComponent extends React.PureComponent {
    state = {
      data: []
    }

    fromStream = ({ message, mapStream, persist }) => {
      const { data } = this.state
      const appendedData =
        mapStream(data, message).length <= persist
          ? mapStream(data, message)
          : mapStream(data, message).slice(1)
      return this.setState({
        data: appendedData
      })
    }

    render() {
      return <BaseComponent fromStream={this.fromStream} {...this.state} {...this.props} />
    }
  }
  return WrappedComponent
}
