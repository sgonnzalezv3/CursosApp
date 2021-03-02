using Dominio;
using Aplicacion.Contratos;
using System.Collections.Generic;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System;

namespace Seguridad
{
    public class JwtGenerador : IJwtGenerador
    {
        public string CrearToken(Usuario usuario , List<string> roles)
        {
            /* Claims : data del usuario que se quiere compartir con el cliente*/
            var claims = new List<Claim>{
                new Claim(JwtRegisteredClaimNames.NameId, usuario.UserName)
            };

            //verificar el arreglo de roles no sea nulo

            if(roles != null){
                //bucle que permita crear por cada elemento de la lista un claim
                foreach(var rol in roles){
                    claims.Add(new Claim(ClaimTypes.Role, rol ));
                }
            }

            /*palabra secreta que desincrepta el token*/
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("Mi palabra secreta"));
            /*Credenciales de acceso*/
            var credenciales = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            /*Descripcion del token*/
            var tokenDescripcion = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(30),
                SigningCredentials = credenciales
            };

            /*Crear Token, escribir el Token*/
            var tokenManejador = new JwtSecurityTokenHandler();
            var token = tokenManejador.CreateToken(tokenDescripcion);
            return tokenManejador.WriteToken(token); //devolver el string del Token



        }
    }
}