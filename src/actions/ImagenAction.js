//los action son para funciones globales

export const obtenerDataImagen = (imagen) => {
  return new Promise((resolve, eject) => {
    const nombre = imagen.name;
    const extension = imagen.name.split(".").pop();

    //convertir file a base 64

    //leer la data ingresando
    const lector = new FileReader();
    lector.readAsDataURL(imagen);
    //cargue dentro de la funcion y que devuelva el resultado
    lector.onload = () =>
      resolve({
        //divite el texto en arreglos dividido en las comas encontrada y
        //toma el primer arreglo
        data: lector.result.split(",")[1],
        nombre: nombre,
        extension: extension,
      });

    // si hay error que lo devuelva.
    lector.onerror = (error) => PromiseRejectionEvent(error);
  });
};
