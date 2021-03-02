import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import style from "../Tool/Style";
import { registroUsuario } from "../../actions/UsuarioAction";
import * as yup from "yup";
import { Formik, useFormik } from "formik";
import { useStateValue } from "../../contexto/store";
import { withRouter } from "react-router-dom";

const validationSchema = yup.object({
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const RegistrarUsuario = () => {

  const [{ usuarioSesion }, dispatch] = useStateValue();
  const [usuario, setUsuario] = useState({
    nombreCompleto: "",
    email: "",
    password: "",
    confirmarPassword: "",
    username: "",
  });
  
  const ingresarValoresMemoria = (e) => {
    const { name, value } = e.target; // captura los atributos de la caja de texto
    setUsuario((anterior) => ({
      ...anterior, // indica todo lo que tenia anteriormente
      [name]: value, //solo el nombre completo se cambia
      //[nombreCompleto] : "santi gonzalez"
    }));
  };
  const registrarElUsuario = (e) => {
    e.preventDefault(); //evita que la pagina se refresque cada vez que se da click en el boton
    //llamar el action con el contenido como parametro
    registroUsuario(usuario, dispatch).then((response) => {
      window.localStorage.setItem("token_seguridad", response.data.token);
      window.location.reload(false);
      if (response.status !== 200) {
        console.log("holii");
      } else {
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: "Usuario registrado exitosamente!",
          },
        });
      }
    });
  };
  return (
    <Container component="main" maxWidth="md" justify="center">
      <div style={style.paper}>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <form style={style.form}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <TextField
                name="nombreCompleto"
                value={usuario.nombreCompleto} // apuntador de la memoria
                onChange={ingresarValoresMemoria} // metodo
                variant="outlined"
                fullWidth
                label="Name"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                value={usuario.email} // apuntador de la memoria
                onChange={ingresarValoresMemoria} // metodo
                variant="outlined"
                fullWidth
                label="Email"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="username"
                value={usuario.username} // apuntador de la memoria
                onChange={ingresarValoresMemoria} // metodo
                variant="outlined"
                fullWidth
                label="Username"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="password"
                value={usuario.password} // apuntador de la memoria
                onChange={ingresarValoresMemoria} // metodo
                type="password"
                variant="outlined"
                fullWidth
                label="Password"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="confirmarPassword"
                value={usuario.confirmarPassword} // apuntador de la memoria
                onChange={ingresarValoresMemoria} // metodo
                type="password"
                variant="outlined"
                fullWidth
                label="Confirm password"
              />
            </Grid>
          </Grid>
          <Grid container justify="center">
            <Grid item xs={12} md={6}>
              <Button
                onClick={registrarElUsuario}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                style={style.submit}
              >
                Enviar
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};
export default withRouter(RegistrarUsuario);
