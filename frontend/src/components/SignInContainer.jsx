import styled from 'styled-components';

const SignInContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  z-index: 2;
  ${props => (props['data-signin-in'] !== true ? `transform: translateX(100%);` : null)}
`;

export default SignInContainer;