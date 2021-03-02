namespace Aplicacion.Seguridad
{
    public class UsuarioData
    {
        //representa la data que sera devuelta al cliente
        public string NombreCompleto {get;set;}
        public string Token {get;set;}
        public string Email {get;set;}
        public string Username {get;set;}
        public string Image {get;set;}
        public ImagenGeneral ImagenPerfil {get;set;}
    }
}