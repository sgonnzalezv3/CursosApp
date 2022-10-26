using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //creando una clase para implementar el mediador para no tener que hacerlo cada vez que se cree un controller
    public class MiControllerBase : ControllerBase
    {
        private IMediator _mediator;

        //creando Objeto
        protected IMediator Mediator => _mediator ?? (_mediator = HttpContext.RequestServices.GetService<IMediator>());
    }
}