import styled from 'styled-components';

const Button = styled.button`
  border-radius: 100px;
  border: 1px solid #2b2a49;
  background-color: #2b2a49;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  padding: 12px 45px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  &:active{
    transform: scale(0.95);
  }
  &:focus {
    outline: none;
  }
`;

export default Button;