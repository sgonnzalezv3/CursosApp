using System.Threading;
using System.Threading.Tasks;
using Aplicacion.ManejadorError;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Aplicacion.Seguridad
{
    public class RolNuevo
    {
        // se encarga de manejar la lógica para crear un nuevo rol dentro de la bd
        public class Ejecuta : IRequest
        {
            public string Nombre { get; set; }
        }
        public class ValidaEjecuta : AbstractValidator<Ejecuta>
        {
            public ValidaEjecuta()
            {
                RuleFor(x => x.Nombre).NotEmpty();
            }
        }
        public class Manejador : IRequestHandler<Ejecuta>
        {
            private readonly RoleManager<IdentityRole> _roleManager;
            public Manejador(RoleManager<IdentityRole> roleManager)
            {
                _roleManager = roleManager;
            }
            public async Task<Unit> Handle(Ejecuta request, CancellationToken cancellationToken)
            {
                //validar que el rol que se va crear no exista!
                var role = await _roleManager.FindByNameAsync(request.Nombre);

                if (role != null)
                {
                    throw new ManejadorExcepcion(System.Net.HttpStatusCode.BadRequest, new { message = "el rol ya se encuentra en el sistema" });

                }
                var result = await _roleManager.CreateAsync(new IdentityRole(request.Nombre));
                if (result.Succeeded)
                {
                    return Unit.Value;
                }
                throw new System.Exception("No se pudo agregar el rol");
            }
        }

    }
}