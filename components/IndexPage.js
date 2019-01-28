import * as React from 'react'
import { createGlobalStyle } from 'styled-components'

import { PageWrapper, Wrapper, Header, FilterBox, ChartBox, Selector } from './styledComponents'
import ChartRenderer from './ChartRenderer'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    font-family: 'Roboto', sans-serif;
  }
   ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar:horizontal {
    height: 8px;
  }

  /* Corner */
  ::-webkit-scrollbar-corner {
    background: inherit;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    -webkit-border-radius: 3px;
    border-radius: 3px;
    background: rgba(0,0,0,0.25);
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 3px;
    border-radius: 3px;
    background: rgba(255,255,255,0.65);
  }
  ::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(255,255,255,0.65);
  }
`

const selectorList = [
  { title: 'Time Series', label: 'time' },
  { title: 'Categorical Series', label: 'categorical' },
  { title: 'Scatterplot', label: 'scatter' },
  { title: 'Streaming Chart', label: 'streaming' },
  { title: 'Stacked Line', label: 'stackedline' },
  { title: 'Biaxial Line', label: 'biaxial' },
  { title: 'Stacked Bar', label: 'stackedbar' },
  { title: 'Interop with vx', label: 'interop' },
  { title: 'Pie Chart', label: 'pie' },
  { title: 'Threshold', label: 'threshold' }
]

export class IndexPage extends React.Component {
  state = {
    active: 'time'
  }

  render() {
    const { active } = this.state
    return (
      <PageWrapper>
        <GlobalStyle />
        <Header>
          <h1>ViiksetJS</h1>
        </Header>
        <h1>Examples</h1>
        <Wrapper>
          <FilterBox>
            {selectorList.map(selector => (
              <Selector
                key={selector.label}
                active={selector.label === active}
                onClick={() => this.setState({ active: selector.label })}
              >
                {selector.title}
              </Selector>
            ))}
          </FilterBox>
          <ChartBox>
            <ChartRenderer active={active} />
          </ChartBox>
        </Wrapper>
      </PageWrapper>
    )
  }
}
