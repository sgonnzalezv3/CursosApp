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
import { useStateValue } from "../../contexto/store";
import { guardarInstructor } from "../../actions/InstructorAction";

/*
        public Guid InstructorId { get; set; }
        public string Nombre { get; set; }
        public string Apellidos { get; set; }
        public string Grado { get; set; }
        public byte[] FotoPerfil { get; set; }
        public DateTime FechaCreacion {get;set;}
 */
const NuevoInstructor = () => {
  const [{sesionUsuario}, dispatch] = useStateValue();
  //manejo de estados de los elementos
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  // manejo de las imagenes
  const [imagenInstructor, setImagenInstructor] = useState(null);

  //variables locales para los demas campos
  const [instructor, setInstructor] = useState({
    nombre: "",
    apellidos: "",
    grado: "",
  });
  const resetearForm = () => {
    setFechaSeleccionada(new Date());
    setImagenInstructor(null);
    setInstructor({
      nombre: "",
      apellidos: "",
      grado: "",
    });
  };
  const ingresarValoresMemoria = (e) => {
    const { name, value } = e.target; //datos de la caja de texto
    setInstructor((anterior) => ({
      ...anterior, //mantenga todo lo anterior
      [name]: value, // excepto la caja de texto y el valor que tiene esta
    }));
  };

  const subirFoto = (imagenes) => {
    const foto = imagenes[0];

    //convertir file a base60
    obtenerDataImagen(foto).then((respuesta) => {
      //actualizar la imagen
      setImagenInstructor(respuesta);
    });
  };
  const guardarInstructorBoton = (e) => {
    e.preventDefault();
    //crear un nuevo id para relacionar ambos objetos en la bd
    const instructorId = uuidv4();
    const objetoInstructor = {
      nombre: instructor.nombre,
      apellidos: instructor.apellidos,
      grado: instructor.grado,
      fechaPublicacion: fechaSeleccionada,
      instructorId: instructorId,
    };
    let objetoImagen = null;

    //si existe la imagen, de lo contrario el guardarCurso no lo enviaria
    //debido a que es null
    if (imagenInstructor) {
      //si no hay, no lo enviaria al servidor...
      objetoImagen = {
        nombre: imagenInstructor.nombre,
        data: imagenInstructor.data,
        extension: imagenInstructor.extension,
        objetoReferencia: instructorId,
      };
    }
    //...solo se enviaria el objetoCurso
    guardarInstructor(objetoInstructor, objetoImagen).then((respuestas) => {
      const responseInstructor = respuestas[0];
      const responseImagen = respuestas[1];

      //mensaje que se pinta en el snackbar
      let mensaje = "";
      // evaluando la respuesta respecto a responseCurso
      if (responseInstructor.status === 200) {
        mensaje += "se ha guardado exitosamente el instructor";
        resetearForm();
      } else {
        mensaje += "Errores :" + Object.keys(responseInstructor.data.errors);
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
          Registro de nuevo Instructor
        </Typography>
        <form style={style.form}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <TextField
                name="nombre"
                variant="outlined"
                fullWidth
                label="Ingrese Nombre"
                value={instructor.nombre}
                onChange={ingresarValoresMemoria}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                name="apellidos"
                variant="outlined"
                fullWidth
                label="Ingrese Apellidos"
                value={instructor.apellidos}
                onChange={ingresarValoresMemoria}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="grado"
                variant="outlined"
                fullWidth
                label="Ingrese Grado"
                value={instructor.grado}
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
                  label="Seleccione Fecha de Ingreso del Instructor"
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
                buttonText="Seleccion imagen del instructor"
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
                onClick={guardarInstructorBoton}
              >
                Guardar Instructor
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};
export default NuevoInstructor;
