import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset'

export const GlobalStyle = createGlobalStyle`
  ${reset};

  html {
    width: 100%;
    height: 100%;
  }

  body {
    background-color: ${(props: any) => props.theme.color.darkGray};
    width: 100%;
    height: 100%;
  }

  #root {
    width: 100%;
    height: 100%;
  }
`
