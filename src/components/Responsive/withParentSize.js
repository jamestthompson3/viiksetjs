import React from 'react'
import sizeMe from 'react-sizeme'
import styled from 'styled-components'

const Container = styled.div.attrs({
  style: {
    width: '100%',
    height: '100%'
  }
})`
  position: ${p => (p.x ? 'static' : 'relative')} !important;
`
export default function withParentSize(BaseComponent) {
  class WrappedComponent extends React.PureComponent {
    render() {
      const { x } = this.props
      return (
        <Container
          innerRef={ref => {
            this.container = ref
          }}
          x={x}
        >
          <BaseComponent {...this.props} />
        </Container>
      )
    }
  }

  return sizeMe({ monitorHeight: true, refreshMode: 'debounce', refreshRate: 100 })(
    WrappedComponent
  )
}

