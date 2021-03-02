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
import { PaginacionCurso } from "../../actions/CursoAction";
import { ControlTyping } from "../Tool/ControlTyping";

export const PaginadorCurso = () => {
  const [textoBusquedaCurso, setTextoBusquedaCurso] = useState("");
  //controlo timing
  const typingBuscadorTexto = ControlTyping(textoBusquedaCurso, 900);

  const [paginadorRequest, setPaginadorRequest] = useState({
    titulo: "",
    numeroPagina: 0,
    cantidadElementos: 5,
  });
  const [paginadorResponse, setPaginadorResponse] = useState({
    listaRecords: [],
    totalRecords: 0,
    numeroPaginas: 0,
  });
  //metodo que carge al servidor inmediatamente se haya cargado paginador curso
  useEffect(() => {
    //invokar el action
    //obtener la data
    //poniendo la data dentro de paginador Response
    const obtenerListaCurso = async () => {
      //evaluar estado del timing buscador
      let tituloVariant = "";
      let paginaVariant = paginadorRequest.numeroPagina + 1;
      if (typingBuscadorTexto) {
        tituloVariant = typingBuscadorTexto;
        paginaVariant = 1;
      }
      //crear request
      const objetoPaginadorRequest = {
        titulo: tituloVariant,
        numeroPagina: paginaVariant,
        cantidadElementos: paginadorRequest.cantidadElementos,
      };
      //obtener el response
      const response = await PaginacionCurso(objetoPaginadorRequest);
      //llevar la data a la variable
      setPaginadorResponse(response.data);
    };
    obtenerListaCurso();
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
            name="textoBusquedaCurso"
            variant="outlined"
            label="Busca tu curso"
            onChange={(e) => setTextoBusquedaCurso(e.target.value)}
          />
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Cursos</TableCell>
              <Hidden mdDown>
                <TableCell align="left">Descripcion</TableCell>
                <TableCell align="left">Fecha Publicacion</TableCell>
                <TableCell align="left">Precio Original</TableCell>
                <TableCell align="left">Precio Promocion</TableCell>
              </Hidden>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginadorResponse.listaRecords.map((curso) => (
              <TableRow key={curso.CursoId}>
                <TableCell align="left">{curso.Titulo}</TableCell>
                <Hidden mdDown>
                  <TableCell align="left">{curso.Descripcion}</TableCell>
                  <TableCell align="left">
                    {new Date(curso.FechaPublicacion).toLocaleString()}
                  </TableCell>
                  <TableCell align="left">{curso.PrecioActual}</TableCell>
                  <TableCell align="left">{curso.Promocion}</TableCell>
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
              labelRowsPerPage="Cursos Por Página"
            />
          </TableRow>
        </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
};
