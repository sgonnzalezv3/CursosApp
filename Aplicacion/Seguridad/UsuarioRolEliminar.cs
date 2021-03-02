using System.Threading;
using System.Threading.Tasks;
using Aplicacion.ManejadorError;
using Dominio;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Aplicacion.Seguridad
{
    public class UsuarioRolEliminar
    {
        public class Ejecuta: IRequest{
            public string Username {get;set;}
            public string RolName {get;set;}
        }
        public class EjecutaValidator : AbstractValidator<Ejecuta>{
            public EjecutaValidator()
            {
                RuleFor(x=>x.Username).NotEmpty();
                RuleFor(x=>x.RolName).NotEmpty();
            }
        }
        public class Manejador : IRequestHandler<Ejecuta>
        {
            private readonly UserManager<Usuario> _userManager;
            private readonly RoleManager<IdentityRole> _roleManager;
            public Manejador(UserManager<Usuario> userManager, RoleManager<IdentityRole> roleManager)
            {
                _userManager = userManager;
                _roleManager = roleManager;
            }

            public async Task<Unit> Handle(Ejecuta request, CancellationToken cancellationToken)
            {
                var role = await _roleManager.FindByNameAsync(request.RolName);
                if(role == null){
                    throw new ManejadorExcepcion(System.Net.HttpStatusCode.NotFound, new {message = "no se encontro el rol"});
                }

                var usuarioIdent = await _userManager.FindByNameAsync(request.Username);
                if(role == null){
                    throw new ManejadorExcepcion(System.Net.HttpStatusCode.NotFound, new {message = "no se encontro el usuario"});
                }
                //metodo para eliminar
                var result = await _userManager.RemoveFromRoleAsync(usuarioIdent, request.RolName);
                if(result.Succeeded){
                    return Unit.Value;
                }
                throw new System.Exception("no se pudo eliminar el rol");
            }
        }
    }
}