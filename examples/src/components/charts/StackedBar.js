import React, { Fragment, Component } from 'react'
import styled from 'styled-components'

import stackedData from '../../data/stackedData.json'
import { GraphContainer, Snippet } from '../styledComponents'
import { ChartArea, StackedBar } from 'viiksetjs'

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
`

class StackedBarExample extends Component {
  state = {
    orientation: 'ordinal'
  }
  handleChange = e =>
    e.target.checked
      ? this.setState({ orientation: 'horizontal' })
      : this.setState({ orientation: 'ordinal' })
  render() {
    const { orientation } = this.state
    return (
      <Fragment>
        <InputContainer>
          <label>change chart orientation</label>
          <input type="checkbox" onChange={this.handleChange} />
        </InputContainer>
        <GraphContainer>
          <ChartArea
            data={stackedData.data}
            type={orientation}
            color="grey"
            xKey="activity"
            stroke="grey"
            nogrid
            yKey={orientation === 'horizontal' && 'activity'}
            yTickLabelProps={() => ({ dx: '-3rem', fontSize: 10, strokeWidth: '0.5px' })}
            noYaxis={orientation !== 'horizontal'}
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
            type="ordinal"
            color="grey"
            xKey="activity"
            stroke="grey"
            nogrid
            labelY="Participation Rate"
          >
            <StackedBar
              colors={['#51344D', '#6F5060', '#A78682']}
              orientation={orientation}
              keys={['often', 'sometimes', 'never']}
            />
          </ChartArea>
        `}
        </Snippet>
      </Fragment>
    )
  }
}

export default StackedBarExample
