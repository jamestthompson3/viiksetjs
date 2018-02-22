import React from 'react'
import styled, { injectGlobal } from 'styled-components'

import { ChartArea, LineChart, BarChart } from '../../lib'
import timeSeries from '../data/timeSeries.json'
import categoricalSeries from '../data/categoricalSeries.json'

injectGlobal`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
  }
`

const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const GraphContainer = styled.div`
  width: 80%;
  height: 10rem;
`

const Header = styled.div`
  background: #2189c8;
  display: flex;
  width: 100%;
  flex-direction: column;
`

const IndexPage = () => (
  <PageWrapper>
    <Header>
      <h1 style={{ textAlign: 'center' }}>Welcome to ViiksetJS!</h1>
    </Header>
    <h2>Time Series</h2>
    <GraphContainer>
      <ChartArea data={timeSeries.data} color="#2189C8" stroke="grey">
        <LineChart dataKey="messages" color="#2189C8" />
      </ChartArea>
    </GraphContainer>
    <h2>Categorical Series</h2>
    <GraphContainer>
      <ChartArea
        data={categoricalSeries.data}
        type="ordinal"
        color="#dc7d5b"
        xKey="company"
        stroke="grey"
        nogrid
        labelY='Culinary Score'
      >
        <BarChart dataKey="score" xKey="company" color="#dc7d5b" />
      </ChartArea>
    </GraphContainer>
  </PageWrapper>
)

export default IndexPage
