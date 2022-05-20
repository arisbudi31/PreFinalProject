import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import ReduxThunk from 'redux-thunk'
import userReducer from './redux/reducers/user_reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';

const Reducer = combineReducers({
  user: userReducer
})

const store = createStore(Reducer, composeWithDevTools(applyMiddleware(ReduxThunk)))

const root = createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
