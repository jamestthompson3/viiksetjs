import * as React from 'react';
import { Axis, Margin, ScaleFunction } from '@viiksetjs/utils';
interface GridRendererProps {
  yScale: ScaleFunction;
  width: number;
  left: number;
}
export interface LeftAxisRendererProps {
  type?: string;
  orientation?: string;
  height: number;
  yPoints?: number[] | string[];
  margin: Margin;
}
export interface BottomAxisRendererProps {
  margin: Margin;
  height: number;
  scale: ScaleFunction;
}
export declare const ChildContext: React.Context<any>;
/**
 * Takes React Children and returns true or false if unique axis Id is found
 */
export declare const biaxial: {
  (children: React.ReactNode): boolean;
  displayName: string;
  __docgenInfo: {
    description: string;
    displayName: string;
    props: {};
  };
};
export declare const buildLeftAxis: {
  ({ y, color }: { y: any; color: string }): React.FunctionComponent<
    LeftAxisRendererProps
  >;
  displayName: string;
  __docgenInfo: {
    description: string;
    displayName: string;
    props: {
      y: {
        defaultValue: null;
        description: string;
        name: string;
        required: boolean;
        type: {
          name: string;
        };
      };
      color: {
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
export declare const buildBottomAxis: {
  ({ x, color }: { x: any; color: string }): React.FunctionComponent<
    BottomAxisRendererProps
  >;
  displayName: string;
  __docgenInfo: {
    description: string;
    displayName: string;
    props: {
      x: {
        defaultValue: null;
        description: string;
        name: string;
        required: boolean;
        type: {
          name: string;
        };
      };
      color: {
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
export declare function buildAxis(
  biaxialChildren: boolean,
  position: string,
  defaultAxes: Axis,
  axes: Axis,
  color: string
):
  | React.FunctionComponent<LeftAxisRendererProps>
  | React.FunctionComponent<BottomAxisRendererProps>
  | null;
export declare const buildGrid: (
  gridStroke: string,
  noGrid: boolean
) => React.FunctionComponent<GridRendererProps>;
export {};
