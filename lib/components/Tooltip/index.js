import moment from 'moment';
import { extractY, extractX } from '../../utils/dataUtils';

var Tooltip = function Tooltip(_ref) {
  var calculatedData = _ref.calculatedData,
      xScale = _ref.xScale,
      yScale = _ref.yScale,
      render = _ref.render;

  var yCoords = extractY(calculatedData).map(function (item) {
    return yScale(item);
  });
  var xCoord = extractX(calculatedData).map(function (item) {
    return xScale(moment(item));
  });
  return render({ yCoords: yCoords, xCoord: xCoord });
};

export default Tooltip;