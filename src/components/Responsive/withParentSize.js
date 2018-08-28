import React from 'react'
import { SizeMe } from 'react-sizeme'
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
  const WrappedComponent = props => {
    const { x } = props
    return (
      <SizeMe
        monitorHeight
        refreshMode="debounce"
        refreshRate={100}
        render={({ size }) => (
          <Container x={x}>
            <BaseComponent {...{ ...props, size }} />
          </Container>
        )}
      />
    )
  }

  return WrappedComponent
}
