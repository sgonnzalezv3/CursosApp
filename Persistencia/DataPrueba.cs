using System.Linq;
using System.Threading.Tasks;
using Dominio;
using Microsoft.AspNetCore.Identity;

namespace Persistencia
{
    public class DataPrueba
    {
        public static async Task InsertarData(CursosContext context, UserManager<Usuario> usuarioManager)
        {
            if (!usuarioManager.Users.Any())
            {
                var user =  new Usuario { NombreCompleto = "Ngolo", UserName = "kante", Email = "vaxi.drez@gmail.com" };
                await usuarioManager.CreateAsync(user, "Password123$");
            }
        }
    }
}