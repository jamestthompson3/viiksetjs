import * as React from 'react'
import styled from 'styled-components'

import stackedData from '../../data/stackedData.json'
import { GraphContainer, Snippet } from '../styledComponents'
import { ChartArea, StackedBar } from '../../../lib/index'
import { isMobile } from './constants'

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
`

export class StackedBarExample extends React.Component {
  state = {
    orientation: 'ordinal'
  }

  handleChange = e =>
    e.target.checked
      ? this.setState({ orientation: 'horizontal' })
      : this.setState({ orientation: 'ordinal' })

  render() {
    const { orientation } = this.state
    const isHorizontal = orientation === 'horizontal'
    return (
      <>
        <InputContainer>
          <label>change chart orientation</label>
          <input type="checkbox" onChange={this.handleChange} />
        </InputContainer>
        <GraphContainer>
          <ChartArea
            data={stackedData.data}
            type={isHorizontal ? 'linear' : 'ordinal'}
            orientation={orientation}
            axes={{
              x: {
                numTicks: isMobile ? 1 : 4
              },
              y: {
                tickLabelProps: () => ({
                  dx: isHorizontal ? '0em' : '-3em',
                  fontSize: 10,
                  strokeWidth: '0.5px',
                  textAnchor: isHorizontal ? 'end' : 'middle'
                })
              }
            }}
            color="grey"
            xKey="activity"
            stroke="grey"
            nogrid
            yKey={isHorizontal && 'activity'}
          >
            <StackedBar
              colors={['#51344D', '#6F5060', '#A78682']}
              keys={['often', 'sometimes', 'never']}
            />
          </ChartArea>
        </GraphContainer>
        <Snippet>
          {`
        <ChartArea
            data={stackedData.data}
            type={isHorizontal ? "linear" : "ordinal"}
            orientation={orientation}
            axes={{
              x: {
                numTicks: isMobile ? 1 : 4
              },
              y: isHorizontal
                ? null
                : {
                    tickLabelProps: () => ({
                      dx: isHorizontal ? "0rem" : "-3rem",
                      fontSize: 10,
                      strokeWidth: "0.5px",
                      textAnchor: isHorizontal ? "end" : "middle"
                    })
                  }
            }}
            color="grey"
            xKey="activity"
            stroke="grey"
            nogrid
            yKey={isHorizontal && "activity"}
          >
            <StackedBar
              colors={["#51344D", "#6F5060", "#A78682"]}
              keys={["often", "sometimes", "never"]}
            />
          </ChartArea>
      `}
        </Snippet>
      </>
    )
  }
}
