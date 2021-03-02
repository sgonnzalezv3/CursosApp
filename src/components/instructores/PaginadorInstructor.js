import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TablePagination,
  Hidden,
  TextField,
  Grid,
  TableFooter,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { PaginacionInstructor } from "../../actions/InstructorAction";
import { ControlTyping } from "../Tool/ControlTyping";

export const PaginadorInstructor = () => {
  const [textoBusquedaInstructor, setTextoBusquedaInstructor] = useState("");
  //controlo timing
  const typingBuscadorTexto = ControlTyping(textoBusquedaInstructor, 900);

  const [paginadorRequest, setPaginadorRequest] = useState({
    nombre: "",
    numeroPagina: 0,
    cantidadElementos: 5,
  });
  const [paginadorResponse, setPaginadorResponse] = useState({
    listaRecords: [],
    totalRecords: 0,
    numeroPaginas: 0,
  });
  //metodo que carge al servidor inmediatamente se haya cargado paginador instructor
  useEffect(() => {
    //invokar el action
    //obtener la data
    //poniendo la data dentro de paginador Response
    const obtenerListaInstructor = async () => {
      //evaluar estado del timing buscador
      let nombreVariant = "";
      let paginaVariant = paginadorRequest.numeroPagina + 1;
      if (typingBuscadorTexto) {
        nombreVariant = typingBuscadorTexto;
        paginaVariant = 1;
      }
      //crear request
      const objetoPaginadorRequest = {
        nombre: nombreVariant,
        numeroPagina: paginaVariant,
        cantidadElementos: paginadorRequest.cantidadElementos,
      };
      //obtener el response
      const response = await PaginacionInstructor(objetoPaginadorRequest);
      //llevar la data a la variable
      setPaginadorResponse(response.data);
    };
    obtenerListaInstructor();
  }, [paginadorRequest, typingBuscadorTexto]); //cada vez que paginadorRequest cambie, se va ejecutar el useEffect

  const cambiarPagina = (event, nuevaPagina) => {
    //cada vez que cambia de pagina debe ocurrir una llamada al servidor
    setPaginadorRequest((anterior) => ({
      ...anterior,
      //cambia string a int
      numeroPagina: parseInt(nuevaPagina),
    }));
  };
  const cambiarCantidadRecords = (event) => {
    setPaginadorRequest((anterior) => ({
      ...anterior,
      cantidadElementos: parseInt(event.target.value),
      numeroPagina: 0,
    }));
  };

  return (
    <div style={{ padding: "10px", width: "100%" }}>
      <Grid container style={{ paddingTop: "20px", paddingBottom: "20px" }}>
        <Grid item xs={12} sm={4} md={6}>
          <TextField
            fullWidth
            name="textoBusquedaInstructor"
            variant="outlined"
            label="Busca Instructor"
            onChange={(e) => setTextoBusquedaInstructor(e.target.value)}
          />
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Nombre</TableCell>
              <Hidden mdDown>
                <TableCell align="left">Apellido</TableCell>
                <TableCell align="left">FechaCreacion</TableCell>
                <TableCell align="left">Grado</TableCell>
              </Hidden>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginadorResponse.listaRecords.map((instructor) => (
              <TableRow key={instructor.InstructorId}>
                <TableCell align="left">{instructor.Nombre}</TableCell>
                <Hidden mdDown>
                  <TableCell align="left">{instructor.Apellidos}</TableCell>
                  <TableCell align="left">
                    {new Date(instructor.FechaCreacion).toLocaleString()}
                  </TableCell>
                  <TableCell align="left">{instructor.Grado}</TableCell>
                </Hidden>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                count={paginadorResponse.totalRecords}
                rowsPerPage={paginadorRequest.cantidadElementos}
                page={paginadorRequest.numeroPagina}
                onChangePage={cambiarPagina}
                onChangeRowsPerPage={cambiarCantidadRecords}
                labelRowsPerPage="Instructores Por Página"
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
};
