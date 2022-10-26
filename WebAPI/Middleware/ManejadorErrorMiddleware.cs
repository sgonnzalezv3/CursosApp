using System;
using System.Net;
using System.Threading.Tasks;
using Aplicacion.ManejadorError;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace WebAPI.Middleware
{
    /*Intersectador de requerimientos */

    //en el mommento que estemos tratando de enviar un pedido par ainsertar un nuevo curso, en ese momento lo que se va a disparar primero son las validaciones para verificar
    //que la data que esta enviando el cliente sea correcta.
    //Cuando se envia un pedido se disparan validaciones de data correcta
    public class ManejadorErrorMiddleware
    {

        private readonly RequestDelegate _next;
        private readonly ILogger<ManejadorErrorMiddleware> _logger;
        public ManejadorErrorMiddleware(RequestDelegate next, ILogger<ManejadorErrorMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        //metodo para manejar el contexto
        public async Task Invoke(HttpContext context)
        {
            /* Si todos los datos ingresados son correctos, pasa a la transaccion _next*/
            try
            {
                //next es usado para decir que pase a la siguiente transaccion, que fue todo correcto
                await _next(context);
            }
            //si hay datos vacios
            catch (System.Exception ex)
            {
                //se crea la excepcion que dispara el metodo Manejador...
                await ManejadorExcepcionAsincrono(context, ex, _logger);
            }


        }
        private async Task ManejadorExcepcionAsincrono(HttpContext context, Exception ex, ILogger<ManejadorErrorMiddleware> logger)
        {
            object errors = null;
            //evaluar excepciones creadas
            switch (ex)
            {
                case ManejadorExcepcion me: // error en la transaccion
                    logger.LogError(ex, "Error Manager"); //detalla la excepcion
                    errors = me.Errors; //almacena los detalles
                    context.Response.StatusCode = (int)me.Code; // Codigo de status a enviar al cliente
                    break;
                //cuando es una excepcion regular
                case Exception e:
                    logger.LogError(ex, "Server Error");
                    /* Convertir a string el error de mensaje, */
                    errors = string.IsNullOrWhiteSpace(e.Message) ? "Error" : e.Message;
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    break;
            }
            context.Response.ContentType = "application/json"; // formato que regresa el error
            if (errors != null)
            {
                var results = JsonConvert.SerializeObject(new { errors });
                await context.Response.WriteAsync(results);
            }

        }

    }
}