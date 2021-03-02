import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useStateValue } from "../../contexto/store";

const RutaSegura = ({ component: Component, ...rest }) => {
  const [{ sesionUsuario }, dispatch] = useStateValue();
  return (
    <Route
    // caracterisitcas origiales desde el parametro
      {...rest}
      //pintar un componente
      render={(props) =>
        //evaluar que exista
        sesionUsuario ? (
            //evaluar  estado de autenticacion
          sesionUsuario.autenticado == true ? (
              //pinte el componente original
            <Component {...props} {...rest} />
            // si no, haga redirect al login
          ) : (
            <Redirect to="/auth/login" />
          )// si no existe, redirect a login
        ) : (
          <Redirect to="/auth/login" />
        )
      }
    />
  );
};
export default RutaSegura;