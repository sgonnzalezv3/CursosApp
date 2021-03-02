import React, { useState, useEffect } from "react";

export const ControlTyping = (texto, delay) => {
  const [textoValor, setTextoValor] = useState();
  useEffect(() => {
      //semaforo que indica si ya dejo de escribir
    const manejador = setTimeout(() => {
      setTextoValor(texto);
      //delay tiempo de espera
    }, delay);
    return () => {
        //funcion que va reiniciar el valor del manejador que controla el tiempo
      clearTimeout(manejador);
    };
    //se ejecuta cada vez que se ingresa en el campo texto
  }, [texto]);
  return textoValor;
};
