import * as React from 'react'
import { FromStreamArgs } from '../../types'

export default function withStream<T>(BaseComponent: React.ReactNode) {
  class WrappedComponent extends React.PureComponent<any, T[]> {
    state = {
      data: []
    }

    fromStream = ({ message, mapStream, persist }: FromStreamArgs) => {
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
