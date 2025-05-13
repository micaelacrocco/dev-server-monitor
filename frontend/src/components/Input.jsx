import styled from 'styled-components';

const Input = styled.input`
  background-color: #f7f7f5;
  border-radius: 12px;
  border: none;
  padding: 12px 20px;
  margin: 8px;
  width: 100%;
  outline: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.01);

  ::placeholder {
    color: #a6a6a6; 
  }
`;

export default Input;