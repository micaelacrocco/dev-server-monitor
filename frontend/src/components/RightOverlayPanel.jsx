import styled from 'styled-components';
import OverlayPanel from './OverlayPanel';

const RightOverlayPanel = styled(OverlayPanel)`
  right: 0;
  transform: translateX(0);
  ${props => props['data-signin-in'] !== true ? `transform: translateX(20%);` : null}
`;

export default RightOverlayPanel;