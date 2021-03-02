import "./App.css";
import React, { useEffect, useState } from "react";
import { ThemeProvider as MuithemeProvider } from "@material-ui/core/styles";
import theme from "./theme/theme";
import { PerfilUsuario } from "./components/security/PerfilUsuario";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Grid, Snackbar } from "@material-ui/core";
import { AppNavbar } from "./components/navegacion/AppNavbar";
import { useStateValue } from "./contexto/store";
import { obtenerUsuarioActual } from "./actions/UsuarioAction";
import RutaSegura from "./components/navegacion/RutaSegura";
import Login from "./components/security/Login";
import { PaginadorCurso } from "./components/cursos/PaginadorCurso";
import NuevoCurso from "./components/cursos/NuevoCurso";
import RutaSegura2 from "./components/navegacion/RutaSegura2";
import NuevoInstructor from "./components/instructores/NuevoInstructor";
import { PaginadorInstructor } from "./components/instructores/PaginadorInstructor";
import RegistrarUsuario from "./components/security/RegistrarUsuario";

function App() {
  
  //obtener una referencia de la sesion de usuario
  //referencia a la variable global
  //dispatch : representacion del contexto
  const [{ sesionUsario, openSnackbar }, dispatch] = useStateValue();
  //referencia a la data del status del snackbar

  //flag
  const [iniciaApp, setIniciaApp] = useState(false);

  //useEfect se usa cuando se halla cargado el componente react
  useEffect(() => {
    if (!iniciaApp) {
      obtenerUsuarioActual(dispatch)
        .then((response) => {
          setIniciaApp(true); // true para que no se vuelva a ejecutar
        })
        .catch((error) => {
          setIniciaApp(true);
        });
    }
  }, [iniciaApp]);

  //flag que permite al servidor si se cargo o no la llamada del servidor
  return iniciaApp === false ? null : (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openSnackbar ? openSnackbar.open : false}
        autoHideDuration={3000}
        ContentProps={{ "aria-describedby": "message-id" }}
        message={
          <span id="message-id">
            {openSnackbar ? openSnackbar.mensaje : ""}
          </span>
        }
        onClose={() =>
          dispatch({
            type: "OPEN_SNACKBAR",
            openMensaje: {
              open: false,
              mensaje: "",
            },
          })
        }
      ></Snackbar>
      <Router>
        <MuithemeProvider theme={theme}>
          <AppNavbar />
          <Grid container>
            <Switch>
              <RutaSegura2 exact path="/auth/login" component={Login} />
              <RutaSegura2 exact path="/auth/registrar" component={RegistrarUsuario}/>
              
              <RutaSegura exact path="/auth/perfil" component={PerfilUsuario} />
              <RutaSegura exact path="/" component={PerfilUsuario} />
              <RutaSegura exact path="/curso/nuevo" component={NuevoCurso} />
              <RutaSegura exact path="/curso/paginador" component={PaginadorCurso} />
              <RutaSegura exact path="/instructor/nuevo" component={NuevoInstructor} />
              <RutaSegura exact path="/instructor/lista" component={PaginadorInstructor} />


            </Switch>
          </Grid>
        </MuithemeProvider>
      </Router>
    </React.Fragment>
  );
}

export default App;
