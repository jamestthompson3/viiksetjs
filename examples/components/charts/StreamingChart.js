import * as React from 'react'
import get from 'lodash/get'
import set from 'lodash/set'
import clone from 'lodash/clone'
import parse from 'date-fns/parse'
import format from 'date-fns/format'

import { LineChart, StreamableChart } from '@viiksetjs/web'
import { GraphContainer, Snippet, LabelContainer, LabelBlock, Label } from '../styledComponents'
import { isMobile } from './constants'

const streamParser = message => JSON.parse(message.data)
const streamedData = {
  special: 0,
  unspecified: 0,
  newuser: 0,
  user: 0,
  talk: 0
}

const streamMap = message => {
  const type = get(message, 'type')
  streamedData[type] != null
    ? set(streamedData, type, streamedData[type] + 1)
    : set(streamedData, type, 1)
  const appendedData = clone(streamedData)
  set(appendedData, 'time', get(message, 'time'))
  return appendedData
}

export const StreamingChart = () => (
  <>
    <GraphContainer>
      <StreamableChart
        connection="wss://wiki-update-sockets.herokuapp.com/"
        color="#331E38"
        stopPersist={200}
        stroke="grey"
        nogrid
        axes={{
          x: {
            numTicks: isMobile ? 1 : 4,
            format: d => format(parse(d), 'DD HH:mm:ss')
          },
          y: {
            label: 'Type Count'
          }
        }}
        streamParser={streamParser}
        mapStream={streamMap}
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
        <LabelBlock color="#47E5BC" />
        unspecified
      </Label>
      <Label color="#F42272">
        <LabelBlock color="#F42272" />
        special
      </Label>
      <Label color="#B4654A">
        <LabelBlock color="#B4654A" />
        new user
      </Label>
      <Label color="#1319e3">
        <LabelBlock color="#1319e3" />
        user
      </Label>
      <Label color="#731f61">
        <LabelBlock color="#731f61" />
        talk
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
              connection="wss://wiki-update-sockets.herokuapp.com/"
              color="#331E38"
              stopPersist={200}
              stroke="grey"
              nogrid
              axes={{
                x: {
                  numTicks: isMobile ? 1 : 4,
                  format: d => format(parse(d))
                },
                y: {
                  label: 'Type Count'
                }
              }}
              streamParser={streamParser}
              mapStream={streamMap}
          >
            <LineChart dataKey="unspecified" color="#47E5BC" nofill />
            <LineChart dataKey="special" color="#F42272" nofill />
            <LineChart dataKey="newuser" color="#B4654A" nofill />
            <LineChart dataKey="user" color="#9F9FAD" nofill />
            <LineChart dataKey="talk" color="#1F5673" nofill />
          </StreamableChart>

        `}
    </Snippet>
  </>
)
