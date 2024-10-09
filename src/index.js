import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import { isMobile } from 'react-device-detect'
import ThemeProvider, { GlobalStyle } from './Theme'
import LocalStorageContextProvider, {
  Updater as LocalStorageContextUpdater,
  useDarkModeManager,
} from './contexts/LocalStorage'
import TokenDataContextProvider, { Updater as TokenDataContextUpdater } from './contexts/TokenData'
import GlobalDataContextProvider from './contexts/GlobalData'
import PairDataContextProvider, { Updater as PairDataContextUpdater } from './contexts/PairData'
import ApplicationContextProvider from './contexts/Application'
import UserContextProvider from './contexts/User'
import App from './App'

// initialize GA
const GOOGLE_ANALYTICS_ID = process.env.REACT_APP_GOOGLE_ANALYTICS_ID

if (typeof GOOGLE_ANALYTICS_ID === 'string') {
  ReactGA.initialize(GOOGLE_ANALYTICS_ID, {
    gaOptions: {
      storage: 'none',
      storeGac: false,
    },
  })
  ReactGA.set({
    anonymizeIp: true,
    customBrowserType: !isMobile
      ? 'desktop'
      : 'web3' in window || 'ethereum' in window
      ? 'mobileWeb3'
      : 'mobileRegular',
  })
} else {
  ReactGA.initialize('test', { testMode: true, debug: true })
}

function ContextProviders({ children }) {
  return (
    <LocalStorageContextProvider>
      <ApplicationContextProvider>
        <TokenDataContextProvider>
          <GlobalDataContextProvider>
            <PairDataContextProvider>
              <UserContextProvider>{children}</UserContextProvider>
            </PairDataContextProvider>
          </GlobalDataContextProvider>
        </TokenDataContextProvider>
      </ApplicationContextProvider>
    </LocalStorageContextProvider>
  )
}

function Updaters() {
  return (
    <>
      <LocalStorageContextUpdater />
      <PairDataContextUpdater />
      <TokenDataContextUpdater />
    </>
  )
}

function DataProvidedByHeader() {
  const [darkMode] = useDarkModeManager()
  const [mouseOver, setMouseOver] = React.useState(false)
  const backgroundColor = darkMode ? 'rgba(255, 0, 122, 0.5)' : 'rgba(255, 0, 122, 0.65)'
  return (
    <div
      style={{
        backgroundColor,
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        height: '48px',
        width: '100%',
        zIndex: '9999999',
        position: 'sticky',
        top: '0',
      }}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      <a href="https://cido.ai/" target="_blank" rel="noopener noreferrer">
        <div
          style={{
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          Data provided by&nbsp;<b>Cido</b>
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            style={{
              marginLeft: '6px',
              marginTop: '2px',
              rotate: '180deg',
              transform: mouseOver ? 'translateX(-5px)' : 'translateX(0px)',
              transitionDuration: '0.2s',
            }}
          >
            <path
              d="M8.00016 0.666504L0.666824 8.00084L8.00016 15.3342"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M0.666992 8.00084H15.3337"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </a>
    </div>
  )
}

ReactDOM.render(
  <ContextProviders>
    <Updaters />
    <ThemeProvider>
      <>
        <DataProvidedByHeader />
        <GlobalStyle />
        <App />
      </>
    </ThemeProvider>
  </ContextProviders>,
  document.getElementById('root')
)
