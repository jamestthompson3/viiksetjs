/// <reference types="modules" />
import * as React from 'react';
import { ToolTipData, RenderedWithTooltipProps } from 'typedef';
interface Theme {
  [key: string]: string;
}
interface StyledProps {
  [key: string]: any;
  theme: Theme;
}
export declare const findColor: {
  (p: StyledProps): any;
  displayName: string;
  __docgenInfo: {
    description: string;
    displayName: string;
    props: {
      theme: {
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
export declare const StyledText: React.ForwardRefExoticComponent<Pick<
  any,
  string | number | symbol
> & {
  theme?: any;
}>;
export declare const StyledPoint: React.ForwardRefExoticComponent<Pick<
  any,
  string | number | symbol
> & {
  theme?: any;
}>;
export declare const StyledLine: React.ForwardRefExoticComponent<Pick<
  any,
  string | number | symbol
> & {
  theme?: any;
}>;
export declare const StyledBar: React.ForwardRefExoticComponent<Pick<
  any,
  string | number | symbol
> & {
  theme?: any;
}>;
export declare const StyledGridRows: React.ForwardRefExoticComponent<Pick<
  any,
  string | number | symbol
> & {
  theme?: any;
}>;
export declare const StyledLeftAxis: React.ForwardRefExoticComponent<Pick<
  any,
  string | number | symbol
> & {
  theme?: any;
}>;
export declare const StyledRightAxis: React.ForwardRefExoticComponent<Pick<
  any,
  string | number | symbol
> & {
  theme?: any;
}>;
export declare const StyledBottomAxis: React.ForwardRefExoticComponent<Pick<
  any,
  string | number | symbol
> & {
  theme?: any;
}>;
export declare const StyledPatternLines: React.ForwardRefExoticComponent<Pick<
  any,
  string | number | symbol
> & {
  theme?: any;
}>;
export declare const StyledGradient: React.ForwardRefExoticComponent<Pick<
  any,
  string | number | symbol
> & {
  theme?: any;
}>;
export declare const StyledLinePath: React.ForwardRefExoticComponent<Pick<
  any,
  string | number | symbol
> & {
  theme?: any;
}>;
export declare const StyledAreaClosed: React.ForwardRefExoticComponent<Pick<
  any,
  string | number | symbol
> & {
  theme?: any;
}>;
export declare const StyledPie: React.ForwardRefExoticComponent<Pick<
  any,
  string | number | symbol
> & {
  theme?: any;
}>;
export declare const StyledThreshold: React.ForwardRefExoticComponent<Pick<
  any,
  string | number | symbol
> & {
  theme?: any;
}>;
export declare const TooltipWrapper: import('styled-components').StyledComponent<
  'div',
  any,
  {},
  never
>;
/**
 * Wraps a React component and passes the `getRects` function,
 * allowing the wrapped component to have access to both its own bounding rect
 * and the it's parent's bounding rect
 */
export declare const withBounds: {
  (component: React.ReactNode): any;
  displayName: string;
  __docgenInfo: {
    description: string;
    displayName: string;
    props: {};
  };
};
export interface TooltipRendererProps extends RenderedWithTooltipProps {
  tooltipStyles: {
    content: React.CSSProperties;
    wrapper: React.CSSProperties;
  };
  tooltipContent(tooltipData: ToolTipData): React.ReactElement;
}
/**
 * Wrapper component for default tooltip
 */
export declare const defaultTooltipRenderer: {
  ({
    tooltipData,
    tooltipContent,
    color,
    x,
    tooltipStyles,
  }: TooltipRendererProps): JSX.Element;
  displayName: string;
  __docgenInfo: {
    description: string;
    displayName: string;
    props: {
      tooltipStyles: {
        defaultValue: null;
        description: string;
        name: string;
        required: boolean;
        type: {
          name: string;
        };
      };
      tooltipContent: {
        defaultValue: null;
        description: string;
        name: string;
        required: boolean;
        type: {
          name: string;
        };
      };
      calculatedData: {
        defaultValue: null;
        description: string;
        name: string;
        required: boolean;
        type: {
          name: string;
        };
      };
      tooltipData: {
        defaultValue: null;
        description: string;
        name: string;
        required: boolean;
        type: {
          name: string;
        };
      };
      x: {
        defaultValue: null;
        description: string;
        name: string;
        required: boolean;
        type: {
          name: string;
        };
      };
      mouseX: {
        defaultValue: null;
        description: string;
        name: string;
        required: boolean;
        type: {
          name: string;
        };
      };
      mouseY: {
        defaultValue: null;
        description: string;
        name: string;
        required: boolean;
        type: {
          name: string;
        };
      };
      showTooltip: {
        defaultValue: null;
        description: string;
        name: string;
        required: boolean;
        type: {
          name: string;
        };
      };
      yCoords: {
        defaultValue: null;
        description: string;
        name: string;
        required: boolean;
        type: {
          name: string;
        };
      };
      width: {
        defaultValue: {
          value: number;
        };
        description: string;
        name: string;
        required: boolean;
        type: {
          name: string;
        };
      };
      stroke: {
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
      height: {
        defaultValue: {
          value: number;
        };
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
/**
 * Default tooltip content function
 */
export declare const defaultTooltipContent: {
  ({ tooltipData }: { tooltipData: ToolTipData }): JSX.Element[];
  displayName: string;
  __docgenInfo: {
    description: string;
    displayName: string;
    props: {
      tooltipData: {
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
export declare function Indicator({
  yCoords,
  x,
  stroke,
  color,
}: RenderedWithTooltipProps): JSX.Element;
export declare namespace Indicator {
  var displayName: string;
  var __docgenInfo: {
    description: string;
    displayName: string;
    props: {
      calculatedData: {
        defaultValue: null;
        description: string;
        name: string;
        required: boolean;
        type: {
          name: string;
        };
      };
      tooltipData: {
        defaultValue: null;
        description: string;
        name: string;
        required: boolean;
        type: {
          name: string;
        };
      };
      tooltipContent: {
        defaultValue: null;
        description: string;
        name: string;
        required: boolean;
        type: {
          name: string;
        };
      };
      x: {
        defaultValue: null;
        description: string;
        name: string;
        required: boolean;
        type: {
          name: string;
        };
      };
      mouseX: {
        defaultValue: null;
        description: string;
        name: string;
        required: boolean;
        type: {
          name: string;
        };
      };
      mouseY: {
        defaultValue: null;
        description: string;
        name: string;
        required: boolean;
        type: {
          name: string;
        };
      };
      showTooltip: {
        defaultValue: null;
        description: string;
        name: string;
        required: boolean;
        type: {
          name: string;
        };
      };
      yCoords: {
        defaultValue: null;
        description: string;
        name: string;
        required: boolean;
        type: {
          name: string;
        };
      };
      width: {
        defaultValue: null;
        description: string;
        name: string;
        required: boolean;
        type: {
          name: string;
        };
      };
      stroke: {
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
      height: {
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
}
export {};
