import {
  Avatar,
  Button,
  Drawer,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import FotoUsuarioTemp from "../../../logo.svg";
import { useStateValue } from "../../../contexto/store";
import { MenuIzquierda } from "./MenuIzquierda";
import { withRouter } from "react-router-dom";
import { MenuDerecha } from "./MenuDerecha";

//estructura para responsive
const useStyles = makeStyles((theme) => ({
  seccionDesktop: {
    display: "none",
    //si se trata de tablet o desktop rompa el secciondesktop de arriba (mostrarlo)
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  seccionMobile: {
    display: "flex",
    //si se trata de tablet o desktop (ocultar)
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  grow: {
    //grow toma todo el espacio disponible de un div
    flexGrow: 1,
  },
  avatarSize: {
    width: 40,
    height: 40,
  },
  list: {
    width: 250,
  },
  listItemText: {
    fontSize: "14px",
    fontWeight: 600,
    paddingLeft: "15px",
    color: "#212121",
  },
}));

const BarSesion = (props) => {
  const classes = useStyles();

  //invocar variable global de estado
  const [{ sesionUsuario }, dispatch] = useStateValue();
  // variable local que indica que cuando se inicialice va estar cerrado
  const [abrirMenuIzquierda, setAbrirMenuIzquierda] = useState(false);
  const [abrirMenuDerecha, setAbrirMenuDerecha] = useState(false);

  //actualizar el menu
  const cerrarMenuIzquierda = () => {
    setAbrirMenuIzquierda(false);
  };
  const abrirMenuIzquierdaAction = () => {
    setAbrirMenuIzquierda(true);
  };
  const cerrarMenuDerecha = () => {
    setAbrirMenuDerecha(false);
  };
  const salirSesionApp = () => {
    localStorage.removeItem("token_seguridad");
    //actualizar la variable global
    dispatch({
      type : "SALIR_SESION",
      nuevoUsuario : null,
      autenticado : false
    })
    props.history.push("/auth/login");
  };
  const abrirMenuDerechaAction = () => {
    setAbrirMenuDerecha(true);
  }
  const irAPerfil = () => {
    props.history.push("/auth/perfil");
  }

  return (
    <React.Fragment>
      {/* Drawer permite poner barra de naveacion */}
      <Drawer
        open={abrirMenuIzquierda}
        onClose={cerrarMenuIzquierda}
        anchor="left"
      >
        <div
          className={classes.list}
          onKeyDown={cerrarMenuIzquierda}
          onClick={cerrarMenuIzquierda}
        >
          <MenuIzquierda classes={classes} />
        </div>
      </Drawer>

      <Drawer
        open={abrirMenuDerecha}
        onClose={cerrarMenuDerecha}
        anchor="right"
      >
        <div
          className = {classes.list}
          onKeyDown={cerrarMenuDerecha}
          onClick={cerrarMenuDerecha}
        >
          <MenuDerecha
            classes={classes}
            salirSesion={salirSesionApp}
            usuario={sesionUsuario ? sesionUsuario.usuario : null}
          />
        </div>
      </Drawer>
      {/*en el toolbar se colocan todos los componentes graficos */}
      <Toolbar>
        <IconButton color="inherit" onClick={abrirMenuIzquierdaAction}>
          <i className="material-icons">menu</i>
        </IconButton>
        <Typography variant="h6">Cursos Online</Typography>

        {/* Creando un espacio*/}
        <div className={classes.grow}></div>
        {/* Encerrando los componentes que se muestran solo en desktop o tablet */}
        <div className={classes.seccionDesktop}>
          <Button color="inherit" onClick={salirSesionApp}>Salir</Button>
          <Button color="inherit" onClick={irAPerfil}>
            {sesionUsuario ? sesionUsuario.usuario.nombreCompleto : ""}
          </Button>
          <Avatar src={sesionUsuario.usuario.imagenPerfil || FotoUsuarioTemp}></Avatar>
        </div>
        <div className={classes.seccionMobile}>
          <IconButton color="inherit" onClick ={abrirMenuDerechaAction}>
            <i className="material-icons">more_vert</i>
          </IconButton>
        </div>
      </Toolbar>
    </React.Fragment>
  );
};
//withRouter permite que las propiedades de nav
//dentro de ese componente pueda trabajarse
//para poder utilizar el props
export default withRouter(BarSesion);
