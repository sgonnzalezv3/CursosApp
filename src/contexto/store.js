import React, { createContext, useContext, useReducer } from "react";
/* 

*/
export const StateContext = createContext();


/* Privder : suscribir a todos los 
        objetos componentes que tendran acceso a las variables globales */
export const StateProvider = ({ reducer, initialState, children }) => (
  /* Reducer : sirve para cambiar el valor global*/
  /* initialState : storage que almacena todas las variables globales */
  /* children : todos los componentes react hooks del proyecto */

  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {/* a Todos los children */}
    {children}
  </StateContext.Provider>
);

/*Consumer :  */

/*UseContext : dar acceso a la variable sesion 
    global almacenada en el intialState */
    export const useStateValue = () => useContext(StateContext);
