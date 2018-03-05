import React from 'react'
import styled, { injectGlobal } from 'styled-components'
import { Line } from '@vx/shape'
import { get, set, clone } from 'lodash'
import moment from 'moment'

import { ChartArea, LineChart, BarChart, withBounds, YAxis, StreamableChart } from '../../lib'
import timeSeries from '../data/timeSeries.json'
import categoricalSeries from '../data/categoricalSeries.json'
import numericSeries from '../data/numericSeries.json'
import biaxialSeries from '../data/biaxialSeries.json'

injectGlobal`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
  }
`

const PageWrapper = styled.div`
  width: 100%;
  height: 100vh;
  h2 {
    text-align: center;
  }
`

const GraphContainer = styled.div`
  width: 80%;
  height: 20rem;
  margin: auto;
`

const Header = styled.div`
  background: #00395e;
  display: flex;
  height: 100px;
  width: 100%;
  color: #fff;
  flex-direction: column;
  border-bottom: 3px solid #00adee;
`
const Snippet = styled.pre`
  background: #333;
  color: white;
  width: 80%;
  padding-top: 2rem;
  margin: auto;
  padding-bottom: 2rem;
`
const TooltipContainer = styled.span.attrs({
  style: p => ({
    left: `${p.rect ? p.left + p.rect.width : p.left}px`,
    top: `${p.parentRect ? -(p.parentRect.height - p.yCoord + p.rect.height) : p.yCoord}px`
  })
})`
  position: relative;
  pointer-events: none;
`

const LabelContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 85%;
  margin: auto;
`
const LabelBlock = styled.div`
  width: 10px;
  height: 10px;
  margin-right: 3px;
  background: ${p => p.color};
`

const Label = styled.p`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${p => p.color};
`

const Indicator = ({ x, color, height }) => (
  <Line
    from={{ x: x - 2.5, y: 0 }}
    to={{ x: x - 2.5, y: height }}
    stroke={color}
    strokeWidth={5}
    strokeOpacity={1.5}
    style={{ pointerEvents: 'none' }}
  />
)
const BoundedTooltip = withBounds(TooltipContainer)
const LinearTooltip = ({ tooltipData, x, yCoords }) => (
  <BoundedTooltip left={x} yCoord={yCoords[1]}>
    {tooltipData.y < 300 ? '❄️' : '🔥'}
  </BoundedTooltip>
)
const streamParser = message => JSON.parse(message.data)
const streamedData = {
  special: 0,
  unspecified: 0,
  newuser: 0,
  user: 0,
  talk: 0
}
const streamMap = (data, message) => {
  const type = get(message, 'type')
  streamedData[type] != null
    ? set(streamedData, type, streamedData[type] + 1)
    : set(streamedData, type, 1)
  const appendedData = clone(streamedData)
  set(appendedData, 'time', get(message, 'time'))
  return [...data, appendedData]
}
const IndexPage = () => (
  <PageWrapper>
    <Header>
      <h1 style={{ textAlign: 'center' }}>Welcome to ViiksetJS!</h1>
    </Header>
    <h1>Examples</h1>
    <h2>Time Series</h2>
    <GraphContainer>
      <ChartArea data={timeSeries.data} color="#2189C8" stroke="grey">
        <LineChart dataKey="messages" color="#2189C8" />
      </ChartArea>
    </GraphContainer>
    <Snippet>
      {`
        <ChartArea data={timeSeries.data} color="#2189C8" stroke="grey">
          <LineChart dataKey="messages" color="#2189C8" />
        </ChartArea>`}
    </Snippet>
    <h2>Categorical Series</h2>
    <GraphContainer>
      <ChartArea
        data={categoricalSeries.data}
        type="ordinal"
        color="#dc7d5b"
        xKey="company"
        stroke="grey"
        nogrid
        labelY="Culinary Score"
      >
        <BarChart dataKey="score" color="#dc7d5b" />
      </ChartArea>
    </GraphContainer>
    <Snippet>
      {`
      <ChartArea
        data={categoricalSeries.data}
        type="ordinal"
        color="#dc7d5b"
        xKey="company"
        stroke="grey"
        nogrid
        labelY="Culinary Score"
      >
        <BarChart dataKey="score" color="#dc7d5b" />
      </ChartArea>
      `}
    </Snippet>
    <h2>Numeric Data With Custom Tooltip</h2>
    <GraphContainer>
      <ChartArea
        data={numericSeries.data}
        color="#42f4c2"
        stroke="grey"
        xKey="x"
        yKey="y"
        type="linear"
        labelY="Heat (K)"
        labelX="Observation No."
        tooltip={LinearTooltip}
        indicator={Indicator}
      >
        <LineChart dataKey="y" color="#42f4c2" />
      </ChartArea>
    </GraphContainer>
    <Snippet>
      {`
        const LinearTooltip = ({ tooltipData, x, yCoords }) => (
          <BoundedTooltip left={x} yCoord={yCoords[1]}>
             {tooltipData.y < 300 ? '❄️' : '🔥'}
          </BoundedTooltip>
          )
      <ChartArea
        data={numericSeries.data}
        color="#42f4c2"
        stroke="grey"
        xKey="x"
        yKey="y"
        type="linear"
        labelY="Heat (K)"
        labelX="Observation No"
        tooltip={LinearTooltip}
      >
        <LineChart dataKey="y" color="#42f4c2" />
      </ChartArea>
      `}
    </Snippet>
    <h2>Streaming Graph</h2>
    <GraphContainer>
      <StreamableChart
        connection="ws://wiki-update-sockets.herokuapp.com/"
        color="#331E38"
        persist={200}
        stopPersist={200}
        stroke="grey"
        nogrid
        labelY="Type Count"
        streamParser={streamParser}
        mapStream={streamMap}
        formatX={d => moment(d).format('HH:mm:ss')}
      >
        <LineChart dataKey="unspecified" color="#47E5BC" nofill />
        <LineChart dataKey="special" color="#F42272" nofill />
        <LineChart dataKey="newuser" color="#B4654A" nofill />
        <LineChart dataKey="user" color="#1319e3" nofill />
        <LineChart dataKey="talk" color="#731f61" nofill />
      </StreamableChart>
    </GraphContainer>
    <p style={{ textAlign: 'center' }}>Wikipedia edit types</p>
    <LabelContainer>
      <Label color="#47E5BC">
        <LabelBlock color="#47E5BC" />unspecified
      </Label>
      <Label color="#F42272">
        <LabelBlock color="#F42272" />special
      </Label>
      <Label color="#B4654A">
        <LabelBlock color="#B4654A" />new user
      </Label>
      <Label color="#1319e3">
        <LabelBlock color="#1319e3" />user
      </Label>
      <Label color="#731f61">
        <LabelBlock color="#731f61" />talk
      </Label>
    </LabelContainer>
    <Snippet>
      {`
        const streamParser = message => JSON.parse(message.data)
        const streamedData = {
          special: 0,
          unspecified: 0,
          newuser: 0,
          user: 0,
          talk: 0
        }
        const streamMap = (data, message) => {
          const type = get(message, 'type')
          streamedData[type] != null
            ? set(streamedData, type, streamedData[type] + 1)
            : set(streamedData, type, 1)
          const appendedData = clone(streamedData)
          set(appendedData, 'time', get(message, 'time'))
          return [...data, appendedData]
        }


      <StreamableChart
        connection="ws://wiki-update-sockets.herokuapp.com/"
        color="#331E38"
        stroke="grey"
        nogrid
        persist={200}
        stopPersist={200}
        labelY="Type Count"
        streamParser={streamParser}
        mapStream={streamMap}
        formatX={d => moment(d).format('HH:mm:ss')}
      >
        <LineChart dataKey="unspecified" color="#47E5BC" nofill />
        <LineChart dataKey="special" color="#F42272" nofill />
        <LineChart dataKey="newuser" color="#B4654A" nofill />
        <LineChart dataKey="user" color="#9F9FAD" nofill />
        <LineChart dataKey="talk" color="#1F5673" nofill />
      </StreamableChart>

    `}
    </Snippet>
    <h2>Biaxial Line Chart</h2>
    <GraphContainer>
      <ChartArea
        data={biaxialSeries.data}
        color="rgb(238, 66, 244)"
        stroke="rgba(109, 109, 109, 0.13)"
      >
        <LineChart color="rgb(238, 66, 244)" dataKey="users" axisId="users" />
        <LineChart color="rgb(244, 196, 65)" dataKey="posts" axisId="posts" />
        <YAxis
          color="rgb(244, 196, 65)"
          axisId="posts"
          position="right"
          label="posts"
          labelProps={{ y: -20, textAnchor: 'middle', fill: 'rgb(244, 196, 65)', fontSize: '12px' }}
        />
        <YAxis
          color="rgb(238, 66, 244)"
          axisId="users"
          position="left"
          label="users"
          labelProps={{ y: -20, textAnchor: 'middle', fill: 'rgb(238, 66, 244)', fontSize: '12px' }}
        />
      </ChartArea>
    </GraphContainer>
    <Snippet>
      {`
      <ChartArea
        data={biaxialSeries.data}
        color="rgb(238, 66, 244)"
        stroke="rgba(109, 109, 109, 0.13)"
      >
        <LineChart color="rgb(238, 66, 244)" dataKey="users" axisId="users" />
        <LineChart color="rgb(244, 196, 65)" dataKey="posts" axisId="posts" />
        <YAxis
          color="rgb(244, 196, 65)"
          axisId="posts"
          position="right"
          label="posts"
          labelProps={{ y: -20, textAnchor: 'middle', fill: 'rgb(244, 196, 65)', fontSize: '12px' }}
        />
        <YAxis
          color="rgb(238, 66, 244)"
          axisId="users"
          position="left"
          label="users"
          labelProps={{ y: -20, textAnchor: 'middle', fill: 'rgb(238, 66, 244)', fontSize: '12px' }}
        />
      </ChartArea>
      `}
    </Snippet>
    <h2>Stacked Line Chart</h2>
    <GraphContainer>
      <ChartArea
        data={biaxialSeries.data}
        color="rgb(238, 66, 244)"
        stroke="rgba(109, 109, 109, 0.13)"
      >
        <LineChart color="rgb(238, 66, 244)" dataKey="users" />
        <LineChart color="rgb(244, 196, 65)" dataKey="posts" />
      </ChartArea>
    </GraphContainer>
    <Snippet>
      {`
       <ChartArea
        data={biaxialSeries.data}
        color="rgb(238, 66, 244)"
        stroke="rgba(109, 109, 109, 0.13)"
      >
        <LineChart color="rgb(238, 66, 244)" dataKey="users" />
        <LineChart color="rgb(244, 196, 65)" dataKey="posts" />
      </ChartArea>
      `}
    </Snippet>
  </PageWrapper>
)
export default IndexPage
