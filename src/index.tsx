import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Store from './store';
import { Provider } from 'mobx-react';
const MainStore = new Store();

ReactDOM.render(
  <Provider store={MainStore}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
