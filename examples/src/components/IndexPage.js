import React, { Component } from 'react'
import { injectGlobal } from 'styled-components'

import { PageWrapper, Wrapper, Header, FilterBox, ChartBox, Selector } from './styledComponents'
import ChartRenderer from './ChartRenderer'

injectGlobal`
  body {
    margin: 0;
    padding: 0;
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
  { title: 'Stacked Bar', label: 'stackedbar' }
]

class IndexPage extends Component {
  state = {
    active: 'stackedbar'
  }
  render() {
    const { active } = this.state
    return (
      <PageWrapper>
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
export default IndexPage
