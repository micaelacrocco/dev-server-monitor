import styled from 'styled-components';
import OverlayPanel from './OverlayPanel';

const LeftOverlayPanel = styled(OverlayPanel)`
  transform: translateX(-20%);
  ${props => props['data-signin-in'] !== true ? `transform: translateX(0);` : null}
`;

export default LeftOverlayPanel;