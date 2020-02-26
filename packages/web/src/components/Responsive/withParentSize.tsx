import * as React from 'react';
import { SizeMe } from 'react-sizeme';
import styled from 'styled-components';

interface ContainerProps {
  x: number;
}

const Container = styled.div.attrs((_p: ContainerProps): any => ({
  style: {
    width: '100%',
    height: '100%',
  },
}))`
  position: ${p => (p.x ? 'static' : 'relative')} !important;
`;

export default function withParentSize(
  BaseComponent: React.FunctionComponent<any>
) {
  const WrappedComponent: React.FunctionComponent<any> = (props: any) => {
    const { x } = props;
    return (
      <SizeMe monitorHeight refreshMode="debounce">
        {({ size }) => (
          <Container x={x}>
            <BaseComponent {...{ ...props, size }} />
          </Container>
        )}
      </SizeMe>
    );
  };

  return WrappedComponent;
}
