import React from 'react'
import sizeMe from 'react-sizeme'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: ${p => p.position && 'static'} !important;
`

export default function withParentSize(BaseComponent) {
  class WrappedComponent extends React.Component {
    state = {
      parentWidth: null,
      parentHeight: null
    }

    componentDidMount() {
      this.resize()
    }

    componentDidUpdate(prevProps) {
      if (prevProps.size != this.props.size) {
        this.resize()
      }
    }

    resize = () => {
      if (this.container) {
        const boundingRect = this.container.getBoundingClientRect()
        this.setState({
          parentWidth: boundingRect.width,
          parentHeight: boundingRect.height
        })
      }
    }

    render() {
      const { parentWidth, parentHeight } = this.state
      return (
        <Container
          innerRef={ref => {
            this.container = ref
          }}
        >
          {parentWidth !== null &&
            parentHeight !== null && (
              <BaseComponent size={{ width: parentWidth, height: parentHeight }} {...this.props} />
            )}
        </Container>
      )
    }
  }

  return sizeMe({ monitorHeight: true, refreshMode: 'debounce' })(WrappedComponent)
}
