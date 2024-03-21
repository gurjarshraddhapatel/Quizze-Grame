import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { createContext } from 'react';

export const Context = createContext()

const Wrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({})
  const [userScore, setUserScore] = useState("")

  return (
    <Context.Provider value={{isAuthenticated, setIsAuthenticated, loading, setLoading, user, setUser,
                              userScore, setUserScore}}>
      <App />
    </Context.Provider> 
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Wrapper></Wrapper>
);
