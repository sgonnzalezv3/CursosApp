import {
  Avatar,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
  actualizarUsuario,
  obtenerUsuarioActual,
} from "../../actions/UsuarioAction";
import { useStateValue } from "../../contexto/store";

import style from "../Tool/Style";
import reactFoto from "../../logo.svg";
import { v4 as uuidv4 } from "uuid";
import ImageUploader from "react-images-upload";
import { obtenerDataImagen } from "../../actions/ImagenAction";

export const PerfilUsuario = () => {
  // metodo que me permita saber si ya culmino la carga de datos, muestramelos

  const [{ sesionUsuario }, dispatch] = useStateValue();
  const [usuario, setUsuario] = useState({
    nombreCompleto: "",
    email: "",
    password: "",
    confirmarPassword: "",
    username: "",
    imagenPerfil: null,
    fotoUrl: "",
  });
  const ingresarValoresMemoria = (e) => {
    const { name, value } = e.target; //e.target representa la caja de texto
    setUsuario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  useEffect(() => {
    setUsuario(sesionUsuario.usuario);
    //llenar fotoUrl para el avatar
    setUsuario((anterior) => ({
      ...anterior,
      fotoUrl: sesionUsuario.usuario.imagenPerfil,
      imagenPerfil :null
    }));
  }, []);

  const guardarUsuario = (e) => {
    e.preventDefault(); //evita que refresque la pag

    //nos pide la data.
    actualizarUsuario(usuario,dispatch).then((response) => {
      if (response.status == 200) {
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje:
              "Se han guardado exitosamente los cambios en Perfil de usuario",
          },
        });
        window.localStorage.setItem("token_seguridad", response.data.token);
      } else {
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje:
              "Errores al intentar guardar en :" +
              Object.keys(response.data.errors),
          },
        });
      }
      //debe devolver toda la data actualizada
      /* 
      porque va generar un nuevo token y se
      necesita volver a guardar en el storage 
      */
    });
  };

  //**
  //const [{ sesionUsuario }, dispatch] = useStateValue();

  //recibe las imagenes seleccionadas desde el controlupload
  const subirFoto = (imagenes) => {
    //seleccionar una foto, copiarla y pegarla en el avatar

    const foto = imagenes[0];

    //tipo file a fotoUrul
    const fotoUrl = URL.createObjectURL(foto);

    obtenerDataImagen(foto).then((respuesta) => {
      //respuesta es un json
      console.log("respuesta", respuesta);
      setUsuario((anterior) => ({
        ...anterior,
        imagenPerfil: respuesta, //formato File //respuesta es un json proveniente de actionImagen
        fotoUrl: fotoUrl, //Formato Url
      }));
    });
  };

  const fotoKey = uuidv4();
  return (
    <Container component="main" maxWidth="md" justify="center">
      <div style={style.paper}>
        <Avatar style={style.avatar} src={usuario.fotoUrl || reactFoto} />
        <Typography component="h1" variant="h5">
          Perfil de Usuario
        </Typography>

        <form style={style.form}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <TextField
                name="nombreCompleto"
                value={usuario.nombreCompleto}
                onChange={ingresarValoresMemoria}
                variant="outlined"
                fullWidth
                label="Ingrese nombre y apellidos"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="username"
                value={usuario.username}
                onChange={ingresarValoresMemoria}
                variant="outlined"
                fullWidth
                label="Ingrese Username"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                value={usuario.email}
                onChange={ingresarValoresMemoria}
                variant="outlined"
                fullWidth
                label="Ingrese email"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="password"
                name="password"
                value={usuario.Password}
                onChange={ingresarValoresMemoria}
                variant="outlined"
                fullWidth
                label="ingrese password"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="password"
                name="confirmarPassword"
                value={usuario.ConfirmarPassword}
                onChange={ingresarValoresMemoria}
                variant="outlined"
                fullWidth
                label="confirme password"
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <ImageUploader
                withIcon={false}
                key={fotoKey}
                singleImage={true}
                buttonText="Seleccione una imagen de perfil"
                onChange={subirFoto}
                imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                maxFileSize={5242880}
              />
            </Grid>
          </Grid>
          <Grid container justify="center">
            <Grid item xs={12} md={6}>
              <Button
                onClick={guardarUsuario}
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                color="primary"
                style={style.submit}
              >
                Guardar Datos
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};
