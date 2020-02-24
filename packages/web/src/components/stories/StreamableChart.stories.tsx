import * as React from 'react';

import get from 'lodash/get';
import set from 'lodash/set';
import clone from 'lodash/clone';
import parse from 'date-fns/parse';
import format from 'date-fns/format';

import StreamableChart, {
  StreamableChart as Component,
} from '../StreamableChart';
import LineChart from '../LineChart';

import {
  GraphContainer,
  LabelContainer,
  LabelBlock,
  Label,
} from './styledComponents';
import { isMobile } from './constants';
import { GenericData } from 'typedef';

export default {
  title: 'StreamableChart',
  component: Component,
};

export const Example = () => {
  const streamParser = (message: GenericData) => JSON.parse(message.data);

  enum DataType {
    Special = 'special',
    NewUser = 'newuser',
    User = 'user',
    Talk = 'talk',
    Unspecified = 'unspecified',
  }

  interface RawStreamedData {
    type: DataType;
    content: string;
    time: string;
  }

  const streamedData = {
    [DataType.Special]: 0,
    [DataType.Unspecified]: 0,
    [DataType.NewUser]: 0,
    [DataType.User]: 0,
    [DataType.Talk]: 0,
  };

  const streamMap = (message: RawStreamedData) => {
    const type = get(message, 'type');
    streamedData[type] != null
      ? set(streamedData, type, streamedData[type] + 1)
      : set(streamedData, type, 1);
    const appendedData = clone(streamedData);
    set(appendedData, 'time', get(message, 'time'));
    return appendedData;
  };

  return (
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
              format: (d: string) => format(parse(d), 'DD HH:mm:ss'),
            },
            y: {
              label: 'Type Count',
            },
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
    </>
  );
};
