import React from 'react'
import styled, { injectGlobal } from 'styled-components'


injectGlobal`
  body {
    margin: 0;
    padding: 0;
  }
`

const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  background: red;
  display: flex;
  width: 100%;
  flex-direction: column;
`

const IndexPage = () => <PageWrapper>
  <Header>
    <h1 style={{ alignSelf: 'center' }}>Welcome to ViiksetJS!</h1>
  </Header>
</PageWrapper>


export default IndexPage
