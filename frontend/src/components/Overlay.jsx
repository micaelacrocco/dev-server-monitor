import styled from 'styled-components';

const Overlay = styled.div`
  background: #2b2a49;
  background-size: cover;
  background-position: 0 0;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  ${props => (props['data-signin-in'] !== true ? `transform: translateX(50%);` : null)}
`;

export default Overlay;