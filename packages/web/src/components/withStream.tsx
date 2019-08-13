import * as React from 'react';
import { GenericData } from 'typedef';

export interface FromStreamArgs {
  message: any;
  mapStream(message: any): any;
  persist: number;
}

interface InjectedProps {
  data: GenericData[];
  fromStream(args: FromStreamArgs): void;
}

export interface State {
  data: GenericData[];
}

interface TOriginalProps {}
export const withStream = (
  Component:
    | React.ComponentClass<TOriginalProps, InjectedProps>
    | React.StatelessComponent<TOriginalProps & InjectedProps>
) => {
  const result = class WrappedComponent extends React.PureComponent<
    any,
    State
  > {
    state = {
      data: [],
    };

    fromStream = ({ message, mapStream, persist }: FromStreamArgs) => {
      const { data } = this.state;
      const mappedData = mapStream(message);
      const dataToBeAppended = data.length <= persist ? data : data.slice(1);
      return this.setState({
        data: [...dataToBeAppended, mappedData],
      });
    };

    render() {
      return (
        <Component
          fromStream={this.fromStream}
          {...this.state}
          {...this.props}
        />
      );
    }
  };
  return result;
};
