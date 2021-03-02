import {
  Avatar,
  Button,
  Container,
  Divider,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import style from "../Tool/Style";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { loginUsuario } from "../../actions/UsuarioAction";
import { withRouter } from "react-router-dom";
import { useStateValue } from "../../contexto/store";

//Props : está el objeto que permite ahcer redireccionamiento
const Login = (props) => {
  const [{ usuarioSesion }, dispatch] = useStateValue();
  const [usuario, setUsuario] = useState({
    email: "",
    password: "",
  });
  const ingresarValoresMemoria = (e) => {
    const { name, value } = e.target; //targetea la data de los campos de texto
    setUsuario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };
  const registroButton = e => {
    e.preventDefault();
    props.history.push("/auth/registrar");
  }

  const loginUsuariobutton = (e) => {
    e.preventDefault();
    loginUsuario(usuario, dispatch).then((response) => {
      if (response.status === 200) {
        //si es exitoso, setear la variable del local storage
        window.localStorage.setItem("token_seguridad", response.data.token);
        //redireccionar a la pagina principal como logeado
        props.history.push("/");
      } else {
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: "Credenciales de usuario incorrectas",
          }
        })
      }
    })
  }

  return (
    <Container maxWidth="xs" >
      <div style={style.paper} >
        <Avatar style={style.avatar}>
          <LockOutlinedIcon style={style.icon} />
        </Avatar>
        <form stype={style.form}>
          <TextField
            name="email"
            value={usuario.email}
            onChange={ingresarValoresMemoria}
            variant="outlined"
            label="Email"
            fullWidth
          />
          <TextField
            name="password"
            value={usuario.password}
            onChange={ingresarValoresMemoria}
            variant="outlined"
            label="password"
            type="password"
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            onClick={loginUsuariobutton}
            fullWidth
            variant="contained"
            color="primary"
            style={style.submit}
            margin="normal"
          >
            Log In
          </Button>
          

        </form>
        <Button
            type="submit"
            onClick={registroButton}
            variant="contained"
            color="primary"
            margin="normal"
            style = {style.create}
          >
            Create An Account
          </Button>
      </div>
    </Container>
  );
};

export default withRouter(Login);
