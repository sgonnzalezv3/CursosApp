import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import style from "../Tool/Style";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import ImageUploader from "react-images-upload";
import { v4 as uuidv4 } from "uuid";
import { obtenerDataImagen } from "../../actions/ImagenAction";
import { guardarCurso } from "../../actions/CursoAction";
import { useStateValue } from "../../contexto/store";

const NuevoCurso = () => {
  const [{sesionUsuario}, dispatch] = useStateValue();
  //manejo de estados de los elementos
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  // manejo de las imagenes
  const [imagenCurso, setImagenCurso] = useState(null);

  //variables locales para los demas campos
  const [curso, setCurso] = useState({
    titulo: "",
    descripcion: "",
    precio: 0.0,
    promocion: 0.0,
  });
  const resetearForm = () => {
    setFechaSeleccionada(new Date());
    setImagenCurso(null);
    setCurso({
      titulo: "",
      descripcion: "",
      precio: 0.0,
      promocion: 0.0,
    });
  };
  const ingresarValoresMemoria = (e) => {
    const { name, value } = e.target;
    setCurso((anterior) => ({
      ...anterior, //mantenga todo lo anterior
      [name]: value, // excepto la caja de texto
    }));
  };

  const subirFoto = (imagenes) => {
    const foto = imagenes[0];

    //convertir file a base60
    obtenerDataImagen(foto).then((respuesta) => {
      //actualizar la imagen
      setImagenCurso(respuesta);
    });
  };
  const guardarCursoBoton = (e) => {
    e.preventDefault();
    //crear un nuevo id para relacionar ambos objetos en la bd
    const cursoId = uuidv4();
    const objetoCurso = {
      titulo: curso.titulo,
      descripcion: curso.descripcion,
      //parseFloat convierte strings a float
      promocion: parseFloat(curso.promocion || 0.0),
      precio: parseFloat(curso.precio || 0.0),
      fechaPublicacion: fechaSeleccionada,
      cursoId: cursoId,
    };
    let objetoImagen = null;

    //si existe la imagen, de lo contrario el guardarCurso no lo enviaria
    //debido a que es null
    if (imagenCurso) {
      //si no hay, no lo enviaria al servidor...
      objetoImagen = {
        nombre: imagenCurso.nombre,
        data: imagenCurso.data,
        extension: imagenCurso.extension,
        objetoReferencia: cursoId,
      };
    }
    //...solo se enviaria el objetoCurso
    guardarCurso(objetoCurso, objetoImagen).then((respuestas) => {
      const responseCurso = respuestas[0];
      const responseImagen = respuestas[1];

      //mensaje que se pinta en el snackbar
      let mensaje = "";
      // evaluando la respuesta respecto a responseCurso
      if (responseCurso.status === 200) {
        mensaje += "se ha guardado exitosamente el curso";
        resetearForm();
      } else {
        mensaje += "Errores :" + Object.keys(responseCurso.data.errors);
      }
      //evaluar existencia de imagen
      if (responseImagen) {
        if (responseImagen.status === 200) {
          mensaje += "se ha guardado exitosamente la imagen";
        } else {
          mensaje +=
            "Errores en imagen" + Object.keys(responseImagen.data.errors);
        }
      }
      dispatch({
        type: "OPEN_SNACKBAR",
        openMensaje: {
          open: true,
          mensaje: mensaje,
        },
      });
    });
  };

  const fotoKey = uuidv4();
  return (
    <Container component="main" maxWidth="md" justify="center">
      <div style={style.paper}>
        <Typography component="h1" variant="h5">
          Registro de nuevo Curso
        </Typography>
        <form style={style.form}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <TextField
                name="titulo"
                variant="outlined"
                fullWidth
                label="Ingrese Titulo"
                value={curso.titulo}
                onChange={ingresarValoresMemoria}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                name="descripcion"
                variant="outlined"
                fullWidth
                label="Ingrese Descripcion"
                value={curso.descripcion}
                onChange={ingresarValoresMemoria}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="precio"
                variant="outlined"
                fullWidth
                label="Ingrese Precio Normal"
                value={curso.precio}
                onChange={ingresarValoresMemoria}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="promocion"
                variant="outlined"
                fullWidth
                label="Ingrese Precio Promocion"
                value={curso.promocion}
                onChange={ingresarValoresMemoria}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  value={fechaSeleccionada}
                  onChange={setFechaSeleccionada}
                  margin="normal"
                  id="fecha-publicacion-id"
                  label="Seleccione Fecha de Publicacion"
                  format="dd/MM/yyyy"
                  fullWidth
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <ImageUploader
                withIcon={false}
                key={fotoKey}
                singleImage={true}
                buttonText="Seleccion imagen del curso"
                onChange={subirFoto}
                imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                maxFileSize={5242880}
              />
            </Grid>
          </Grid>
          <Grid container justify="center">
            <Grid item xs={12} md={6}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                style={style.submit}
                onClick={guardarCursoBoton}
              >
                Guardar Curso
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};
export default NuevoCurso;
