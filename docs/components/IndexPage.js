import React from 'react'
import styled, { injectGlobal } from 'styled-components'


import { ChartArea, LineChart } from '../../lib'
import timeSeries from '../data/timeSeries.json'


injectGlobal`
  body {
    margin: 0;
    padding: 0;
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
  background: #2189C8;
  display: flex;
  width: 100%;
  flex-direction: column;
`

const IndexPage = () => (
  <PageWrapper>
    <Header>
      <h1 style={{ textAlign: 'center' }}>Welcome to ViiksetJS!</h1>
      <br />
    </Header>
    <h2>Time Series</h2>
    <GraphContainer>
      <ChartArea data={timeSeries.data} color="#2189C8" stroke='grey'>
        <LineChart dataKey="messages" color="#2189C8" />
      </ChartArea>
    </GraphContainer>
  </PageWrapper>
)


export default IndexPage
