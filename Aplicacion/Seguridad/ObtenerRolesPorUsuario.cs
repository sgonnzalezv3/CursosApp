using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Aplicacion.ManejadorError;
using Dominio;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Aplicacion.Seguridad
{
    public class ObtenerRolesPorUsuario
    {
        public class Ejecuta : IRequest<List<string>>
        {
            public string Username {get;set;}
        }
        public class Manejador : IRequestHandler<Ejecuta, List<string>>
        {
            private readonly RoleManager<IdentityRole> _roleManager;
            private readonly UserManager<Usuario> _userManager;
            public Manejador(RoleManager<IdentityRole> roleManager , UserManager<Usuario> userManger)
            {
                _roleManager = roleManager;
                _userManager = userManger;
            }
            public async  Task<List<string>> Handle(Ejecuta request, CancellationToken cancellationToken)
            {
                // verificar si el usuario existe
                var usuarioIdent = await  _userManager.FindByNameAsync(request.Username);
                if(usuarioIdent == null){
                    throw new ManejadorExcepcion(System.Net.HttpStatusCode.NotFound , new {message = "no existe el usuario"});
                }
                var results = await _userManager.GetRolesAsync(usuarioIdent);
                return new List<string>(results);
            }
        }
    }
}