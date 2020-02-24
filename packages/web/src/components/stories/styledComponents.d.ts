import * as React from 'react';
import { ToolTipData } from 'typedef';
export declare const PageWrapper: import('styled-components').StyledComponent<
  'div',
  any,
  {},
  never
>;
export declare const Wrapper: import('styled-components').StyledComponent<
  'div',
  any,
  {},
  never
>;
export declare const Selector: import('styled-components').StyledComponent<
  'h4',
  any,
  {
    active?: boolean | undefined;
  },
  never
>;
export declare const FilterBox: import('styled-components').StyledComponent<
  'div',
  any,
  {},
  never
>;
export declare const ChartBox: import('styled-components').StyledComponent<
  'div',
  any,
  {},
  never
>;
export declare const GraphContainer: import('styled-components').StyledComponent<
  'div',
  any,
  {},
  never
>;
export declare const Header: import('styled-components').StyledComponent<
  'div',
  any,
  {},
  never
>;
export declare const Snippet: {
  ({ children }: { children: React.ReactChildren }): JSX.Element;
  displayName: string;
  __docgenInfo: {
    description: string;
    displayName: string;
    props: {};
  };
};
export declare const LabelContainer: import('styled-components').StyledComponent<
  'div',
  any,
  {},
  never
>;
export declare const LabelBlock: import('styled-components').StyledComponent<
  'span',
  any,
  {},
  never
>;
export declare const Label: import('styled-components').StyledComponent<
  'p',
  any,
  {},
  never
>;
interface IndicatorProps {
  x: number;
  color: string;
  yCoords: number[];
  height: number;
}
export declare const Indicator: {
  ({ x, color, yCoords, height }: IndicatorProps): JSX.Element;
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
      yCoords: {
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
};
interface TooltipProps {
  tooltipData: ToolTipData;
  x: number;
  yCoords: number[];
}
export declare const LinearTooltip: {
  ({ tooltipData, x, yCoords }: TooltipProps): JSX.Element;
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
      x: {
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
    };
  };
};
export declare const BiaxialTooltip: {
  ({ tooltipData, x, yCoords }: TooltipProps): JSX.Element;
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
      x: {
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
    };
  };
};
export {};
