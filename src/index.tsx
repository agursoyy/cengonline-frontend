import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Store from './store';
import { Provider } from 'mobx-react';
const MainStore = new Store();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={MainStore}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
