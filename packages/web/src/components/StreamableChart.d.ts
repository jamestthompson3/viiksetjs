import * as React from 'react';
import { ScaleFunction } from '@viiksetjs/utils';
import { RenderContainerProps, FromStreamArgs, GenericData } from '../typedef';
export declare const StreamableChart: React.FunctionComponent<Props>;
interface Props extends RenderContainerProps {
  persist: number;
  fromStream(args: FromStreamArgs): void;
  xScale: ScaleFunction;
  yScale: ScaleFunction;
  loadingMessage: React.FunctionComponent;
  yScales: {
    [key: string]: ScaleFunction;
  };
  yPoints: any[];
  data: GenericData[];
  stopPersist: number;
  connection: string;
  streamParser(message: any): any;
  mapStream(message: any): any;
}
declare const _default: {
  new (props: Readonly<any>): {
    state: {
      data: never[];
    };
    fromStream: ({
      message,
      mapStream,
      persist,
    }: import('./withStream').FromStreamArgs) => void;
    render(): JSX.Element;
    context: any;
    setState<K extends 'data'>(
      state:
        | import('./withStream').State
        | ((
            prevState: Readonly<import('./withStream').State>,
            props: Readonly<any>
          ) =>
            | import('./withStream').State
            | Pick<import('./withStream').State, K>
            | null)
        | Pick<import('./withStream').State, K>
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
      nextState: Readonly<import('./withStream').State>,
      nextContext: any
    ): boolean;
    componentWillUnmount?(): void;
    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
    getSnapshotBeforeUpdate?(
      prevProps: Readonly<any>,
      prevState: Readonly<import('./withStream').State>
    ): any;
    componentDidUpdate?(
      prevProps: Readonly<any>,
      prevState: Readonly<import('./withStream').State>,
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
      nextState: Readonly<import('./withStream').State>,
      nextContext: any
    ): void;
    UNSAFE_componentWillUpdate?(
      nextProps: Readonly<any>,
      nextState: Readonly<import('./withStream').State>,
      nextContext: any
    ): void;
  };
  new (props: any, context?: any): {
    state: {
      data: never[];
    };
    fromStream: ({
      message,
      mapStream,
      persist,
    }: import('./withStream').FromStreamArgs) => void;
    render(): JSX.Element;
    context: any;
    setState<K extends 'data'>(
      state:
        | import('./withStream').State
        | ((
            prevState: Readonly<import('./withStream').State>,
            props: Readonly<any>
          ) =>
            | import('./withStream').State
            | Pick<import('./withStream').State, K>
            | null)
        | Pick<import('./withStream').State, K>
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
      nextState: Readonly<import('./withStream').State>,
      nextContext: any
    ): boolean;
    componentWillUnmount?(): void;
    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
    getSnapshotBeforeUpdate?(
      prevProps: Readonly<any>,
      prevState: Readonly<import('./withStream').State>
    ): any;
    componentDidUpdate?(
      prevProps: Readonly<any>,
      prevState: Readonly<import('./withStream').State>,
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
      nextState: Readonly<import('./withStream').State>,
      nextContext: any
    ): void;
    UNSAFE_componentWillUpdate?(
      nextProps: Readonly<any>,
      nextState: Readonly<import('./withStream').State>,
      nextContext: any
    ): void;
  };
  contextType?: React.Context<any> | undefined;
};
export default _default;
