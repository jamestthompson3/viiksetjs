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
export declare const withStream: {
  (
    Component:
      | React.ComponentClass<TOriginalProps, InjectedProps>
      | React.StatelessComponent<TOriginalProps & InjectedProps>
  ): {
    new (props: Readonly<any>): {
      state: {
        data: never[];
      };
      fromStream: ({ message, mapStream, persist }: FromStreamArgs) => void;
      render(): JSX.Element;
      context: any;
      setState<K extends 'data'>(
        state:
          | State
          | ((
              prevState: Readonly<State>,
              props: Readonly<any>
            ) => State | Pick<State, K> | null)
          | Pick<State, K>
          | null,
        callback?: (() => void) | undefined
      ): void;
      forceUpdate(callback?: (() => void) | undefined): void;
      readonly props: Readonly<any> &
        Readonly<{
          children?: React.ReactNode;
        }>;
      refs: {
        [key: string]: React.ReactInstance;
      };
      componentDidMount?(): void;
      shouldComponentUpdate?(
        nextProps: Readonly<any>,
        nextState: Readonly<State>,
        nextContext: any
      ): boolean;
      componentWillUnmount?(): void;
      componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
      getSnapshotBeforeUpdate?(
        prevProps: Readonly<any>,
        prevState: Readonly<State>
      ): any;
      componentDidUpdate?(
        prevProps: Readonly<any>,
        prevState: Readonly<State>,
        snapshot?: any
      ): void;
      componentWillMount?(): void;
      UNSAFE_componentWillMount?(): void;
      componentWillReceiveProps?(
        nextProps: Readonly<any>,
        nextContext: any
      ): void;
      UNSAFE_componentWillReceiveProps?(
        nextProps: Readonly<any>,
        nextContext: any
      ): void;
      componentWillUpdate?(
        nextProps: Readonly<any>,
        nextState: Readonly<State>,
        nextContext: any
      ): void;
      UNSAFE_componentWillUpdate?(
        nextProps: Readonly<any>,
        nextState: Readonly<State>,
        nextContext: any
      ): void;
    };
    new (props: any, context?: any): {
      state: {
        data: never[];
      };
      fromStream: ({ message, mapStream, persist }: FromStreamArgs) => void;
      render(): JSX.Element;
      context: any;
      setState<K extends 'data'>(
        state:
          | State
          | ((
              prevState: Readonly<State>,
              props: Readonly<any>
            ) => State | Pick<State, K> | null)
          | Pick<State, K>
          | null,
        callback?: (() => void) | undefined
      ): void;
      forceUpdate(callback?: (() => void) | undefined): void;
      readonly props: Readonly<any> &
        Readonly<{
          children?: React.ReactNode;
        }>;
      refs: {
        [key: string]: React.ReactInstance;
      };
      componentDidMount?(): void;
      shouldComponentUpdate?(
        nextProps: Readonly<any>,
        nextState: Readonly<State>,
        nextContext: any
      ): boolean;
      componentWillUnmount?(): void;
      componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
      getSnapshotBeforeUpdate?(
        prevProps: Readonly<any>,
        prevState: Readonly<State>
      ): any;
      componentDidUpdate?(
        prevProps: Readonly<any>,
        prevState: Readonly<State>,
        snapshot?: any
      ): void;
      componentWillMount?(): void;
      UNSAFE_componentWillMount?(): void;
      componentWillReceiveProps?(
        nextProps: Readonly<any>,
        nextContext: any
      ): void;
      UNSAFE_componentWillReceiveProps?(
        nextProps: Readonly<any>,
        nextContext: any
      ): void;
      componentWillUpdate?(
        nextProps: Readonly<any>,
        nextState: Readonly<State>,
        nextContext: any
      ): void;
      UNSAFE_componentWillUpdate?(
        nextProps: Readonly<any>,
        nextState: Readonly<State>,
        nextContext: any
      ): void;
    };
    contextType?: React.Context<any> | undefined;
  };
  displayName: string;
  __docgenInfo: {
    description: string;
    displayName: string;
    props: {
      propTypes: {
        defaultValue: null;
        description: string;
        name: string;
        required: boolean;
        type: {
          name: string;
        };
      };
      contextTypes: {
        defaultValue: null;
        description: string;
        name: string;
        required: boolean;
        type: {
          name: string;
        };
      };
      defaultProps: {
        defaultValue: null;
        description: string;
        name: string;
        required: boolean;
        type: {
          name: string;
        };
      };
      displayName: {
        defaultValue: null;
        description: string;
        name: string;
        required: boolean;
        type: {
          name: string;
        };
      };
    };
  };
};
export {};
