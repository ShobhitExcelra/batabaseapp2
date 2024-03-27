import { MsalProvider } from "@azure/msal-react";
import { Provider } from 'react-redux';
import appStore from './utils/appStore';
import './App.css';
import Body from './components/Body'
function App({ pca }) {
  return (
    <MsalProvider instance={pca}>
      <Provider store={appStore}><Body/></Provider>
    </MsalProvider>
  );
}

export default App;
