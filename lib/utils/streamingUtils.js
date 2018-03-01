import { get } from 'lodash';

var getStreaming = function getStreaming(props) {
  return get(props, 'data');
};