using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aplicacion.Instructores;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Persistencia.DapperConexion.Instructor;
using Persistencia.Paginacion;

namespace WebAPI.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    
    public class InstructorController : MiControllerBase
    {
        //autorizacion por roles
        /*
        [Authorize(Roles = "Admin")]
        */
        [HttpGet]
        public async Task<ActionResult<List<InstructorModel>>> ObtenerInstructores()
        {
            return await Mediator.Send(new Consulta.Lista());
        }
        [HttpPost]
        public async Task<ActionResult<Unit>> Crear(NuevoInstructor.Ejecuta nuevo)
        {
            return await Mediator.Send(nuevo);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> Actualizar(Guid id, EditarInstructor.Ejecuta data)
        {
            //data instructor id sera igual al que hay en la url
            data.InstructorId = id;

            return await Mediator.Send(data);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Eliminar(Guid id)
        {

            return await Mediator.Send(new EliminarInstructor.Ejecuta{Id = id});
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<InstructorModel>> ObtenerById(Guid id)
        {
            return await Mediator.Send(new ConsultaInstructorId.Ejecuta{Id = id});
        }
        [HttpPost("report")]
        public async Task<ActionResult<PaginacionModel>> Report(PaginacionInstructor.Ejecuta data)
        {
            return await Mediator.Send(data);
        }
    }
}