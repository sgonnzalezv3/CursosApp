import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useStateValue } from "../../contexto/store";

const RutaSegura2 = ({ component: Component, ...rest }) => {
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
            <Redirect to ="/auth/perfil" />
          ) : (
            // si no, haga redirect al login
            <Component {...props} {...rest} />
          ) // si no existe, redirect a login
        ) : (
          <Component {...props} {...rest} />
        )
      }
    />
  );
};
export default RutaSegura2;
