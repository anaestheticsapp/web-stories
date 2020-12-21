import { css } from 'lit-element';

const normalize = css`
  textarea:focus,
  button:focus,
  select:focus,
  input:focus {
    outline: none;
  }
  textarea,
  button,
  input,
  select {
    font-family: inherit;
    font-size: inherit;
    border: 0;
  }
  button {
    text-align: left;
    color: inherit;
    background-color: transparent;
    padding: 0px;
    line-height: 20px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  summary {
    outline: none;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
`;
export default normalize;
