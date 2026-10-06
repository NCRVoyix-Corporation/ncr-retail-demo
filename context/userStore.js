import React, { useReducer, useEffect } from 'react';
const isServer = typeof window === 'undefined';

let reducer = (userStore, newUserStore) => {
  if (newUserStore === null) {
    if (!isServer) {
      localStorage.removeItem('userStore');
    }
    return initialState;
  }
  return { ...userStore, ...newUserStore };
};

const initialState = {};
let localState;

if (!isServer) {
  localState = JSON.parse(localStorage.getItem('userStore'));
}

const UserStoreContext = React.createContext();

function UserStoreProvider(props) {
  const [userStore, setUserStore] = useReducer(reducer, localState || initialState);

  useEffect(() => {
    if (!isServer) {
      localStorage.setItem('userStore', JSON.stringify(userStore));
    }
  }, [userStore]);
  
  return <UserStoreContext.Provider value={{ userStore, setUserStore }}>{props.children}</UserStoreContext.Provider>;
}

export { UserStoreContext, UserStoreProvider };
