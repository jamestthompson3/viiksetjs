import moment from 'moment'
import { extractY, extractX } from '../../utils/dataUtils'

const Tooltip = ({ calculatedData, xScale, yScale, render }) => {
  const yCoords = extractY(calculatedData).map(item => yScale(item))
  const xCoord = extractX(calculatedData).map(item => xScale(moment(item)))
  return render({ yCoords, xCoord })
}

export default Tooltip
