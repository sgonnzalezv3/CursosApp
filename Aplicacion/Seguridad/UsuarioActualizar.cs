using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Aplicacion.Contratos;
using Aplicacion.ManejadorError;
using Dominio;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistencia;

namespace Aplicacion.Seguridad
{
    public class UsuarioActualizar
    {
        public class Ejecuta : IRequest<UsuarioData>
        {

            public string NombreCompleto { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string Username { get; set; }
            public ImagenGeneral ImagenPerfil { get; set; }
        }
        public class EjecutaValidador : AbstractValidator<Ejecuta>
        {
            public EjecutaValidador()
            {
                RuleFor(x => x.NombreCompleto).NotEmpty();
                RuleFor(x => x.Email).NotEmpty();
                RuleFor(x => x.Password).NotEmpty();
                RuleFor(x => x.Username).NotEmpty();
            }
        }
        public class Manejador : IRequestHandler<Ejecuta, UsuarioData>
        {
            private readonly UserManager<Usuario> _userManager;
            private readonly CursosContext _cursosContext;

            /* necesitamos llamarlo por si el usuario desea cambiar su password */
            private readonly IJwtGenerador _jwtGenerador;

            /* Necesitamos llamarlo para encriptar el password  */
            private IPasswordHasher<Usuario> _passwordHasher;
            public Manejador(UserManager<Usuario> userManager, CursosContext cursosContext, IJwtGenerador jwtGenerador, IPasswordHasher<Usuario> passwordHasher)
            {
                _userManager = userManager;
                _cursosContext = cursosContext;
                _jwtGenerador = jwtGenerador;
                _passwordHasher = passwordHasher;
            }
            public async Task<UsuarioData> Handle(Ejecuta request, CancellationToken cancellationToken)
            {
                /* Evaluar existencia del usuario */

                var usuarioIden = await _userManager.FindByNameAsync(request.Username);

                if (usuarioIden == null)
                {
                    throw new ManejadorExcepcion(System.Net.HttpStatusCode.NotFound, new { message = "no se ha encontrado el usuario con ese id" });
                }
                /* Evaluar si el emali ya existe */

                var resultado = await _cursosContext.Users.Where(x => x.Email == request.Email && x.UserName != request.Username).AnyAsync();

                /* si ya existe */
                if (resultado)
                {
                    throw new ManejadorExcepcion(System.Net.HttpStatusCode.InternalServerError, new { message = "El email ingresado ya se encuentra registrado por otro usuario en el sistema" });
                }


                //si en el campo de imagen se ha puesto algo :
                if (request.ImagenPerfil != null)
                {
                    //Evaluar si existe o no la imagen para el Usuario
                    var resultadoImagen = await _cursosContext.Documento.Where(x => x.ObjetoReferencia == new Guid(usuarioIden.Id)).FirstOrDefaultAsync();
                    if (resultadoImagen == null)
                    {
                        var imagen = new Documento
                        {
                            //base 64 string a byte
                            Contenido = System.Convert.FromBase64String(request.ImagenPerfil.Data),
                            Nombre = request.ImagenPerfil.Nombre,
                            Extension = request.ImagenPerfil.Extension,
                            ObjetoReferencia = new Guid(usuarioIden.Id),
                            DocumentoId = Guid.NewGuid(),
                            FechaCreacion = DateTime.UtcNow

                        };
                        _cursosContext.Documento.Add(imagen);
                    }
                    else
                    { //si ya hay una pero se quiere cambiar la imagen
                        resultadoImagen.Contenido = System.Convert.FromBase64String(request.ImagenPerfil.Data);
                        resultadoImagen.Nombre = request.ImagenPerfil.Nombre;
                        resultadoImagen.Extension = request.ImagenPerfil.Extension;
                    }

                }
                usuarioIden.NombreCompleto = request.NombreCompleto;
                usuarioIden.PasswordHash = _passwordHasher.HashPassword(usuarioIden, request.Password);
                usuarioIden.Email = request.Email;
                var resultUpdate = await _userManager.UpdateAsync(usuarioIden);

                /* obtener lista de roles del usuario ya que el token lo solicita */
                var resultRoles = await _userManager.GetRolesAsync(usuarioIden);
                /*  Convertir IList a List */
                var listRoles = new List<string>(resultRoles);

                /*Devolver imagen*/                                                                                       //depronto quitar
                var imagenPerfil = await _cursosContext.Documento.Where(x=>x.ObjetoReferencia == new Guid(usuarioIden.Id)).FirstOrDefaultAsync();
                ImagenGeneral imagenGeneral = null;
                if(imagenPerfil != null){
                    imagenGeneral = new ImagenGeneral {
                        Data = Convert.ToBase64String(imagenPerfil.Contenido),
                        Nombre = imagenPerfil.Nombre,
                        Extension = imagenPerfil.Extension
                    };
                }
                if (resultUpdate.Succeeded)
                {
                    return new UsuarioData
                    {
                        NombreCompleto = usuarioIden.NombreCompleto,
                        Username = usuarioIden.UserName,
                        Email = usuarioIden.Email,
                        Token = _jwtGenerador.CrearToken(usuarioIden, listRoles),
                        ImagenPerfil = imagenGeneral
                    };
                }
                throw new System.Exception("No se ha podido actualizar el usuario");

            }
        }
    }
}