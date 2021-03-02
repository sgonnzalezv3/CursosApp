import { AppBar } from "@material-ui/core";
import React from "react";
import { useStateValue } from "../../contexto/store";
import BarSesion from "./bar/BarSesion";

export const AppNavbar = () => {
  const [{ sesionUsuario }, dispatch] = useStateValue();

  return sesionUsuario ? (
    sesionUsuario.autenticado == true ? (
      <AppBar position="static">
        <BarSesion />
      </AppBar>
    ) : null
  ) : null;

  /*
  return (
    <AppBar position="static">
      <BarSesion />
    </AppBar>
  );
  */
};
