import React from 'react'
import { get, set, clone } from 'lodash'
import moment from 'moment'
import { injectGlobal } from 'styled-components'

import { ChartArea, LineChart, BarChart, YAxis, StreamableChart, ScatterPlot } from '../../lib'
import timeSeries from '../data/timeSeries.json'
import categoricalSeries from '../data/categoricalSeries.json'
import numericSeries from '../data/numericSeries.json'
import biaxialSeries from '../data/biaxialSeries.json'
import {
  PageWrapper,
  Wrapper,
  GraphContainer,
  Header,
  Snippet,
  LabelContainer,
  LabelBlock,
  Label,
  Indicator,
  LinearTooltip,
  BiaxialTooltip
} from './styledComponents'

injectGlobal`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
  }
`

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
        <h1>ViiksetJS</h1>
      </Header>
    <Wrapper>
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
          <ScatterPlot dataKey="y" color="#42f4c2" />
        </ChartArea>
      </GraphContainer>
      <Snippet>
        {`
          const Indicator = ({ x, color, yCoords, height }) => (
            <Line
              from={{ x: x, y: height }}
              to={{ x: x, y: yCoords[1] + 8 }}
              stroke={color}
              strokeWidth={5}
              strokeOpacity={1.5}
              style={{ pointerEvents: 'none' }}
            />
          )
          const LinearTooltip = ({ tooltipData, x, yCoords }) => (
              <BoundedTooltip left={x} yCoord={yCoords[1] - 15}>
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
          indicator={Indicator}
        >
          <ScatterPlot dataKey="y" color="#42f4c2" />
        </ChartArea>
        `}
      </Snippet>
      <h2>Streaming Graph</h2>
      <GraphContainer>
        <StreamableChart
          connection="ws://wiki-update-sockets.herokuapp.com/"
          color="#331E38"
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
          stroke="rgba(109, 109, 109, 0.25)"
          tooltip={BiaxialTooltip}
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
          stroke="rgba(109, 109, 109, 0.25)"
          tooltip={BiaxialTooltip}
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
    </Wrapper>
  </PageWrapper>
)
export default IndexPage
