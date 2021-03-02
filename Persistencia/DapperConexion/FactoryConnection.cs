using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Options;

namespace Persistencia.DapperConexion
{
    public class FactoryConnection : IFactoryConnection
    {
        /*Conexion dinamica con la bd a traves de dapper*/
        private IDbConnection _connection;

        //acceso a la cadena de conexion
        private readonly IOptions<ConexionConfiguracion> _configs;

        public FactoryConnection(IOptions<ConexionConfiguracion> configs)
        {
            _configs = configs;
        }
        public void CloseConnection()
        {
            //si la conexion esta abierta
            if(_connection != null && _connection.State == ConnectionState.Open){
                //cerrar la conexion
                _connection.Close();
            }
        }

        public IDbConnection GetConnection()
        {
            //evaluar si existe o no
            if (_connection == null)
            {

                _connection = new SqlConnection(_configs.Value.DefaultConnection);
                /*Se ha creado la cadena de conexion*/

            }

            //evaluar estado de la cadena
            if (_connection.State != ConnectionState.Open)
            {
                //si esta cerrada, se abre
                _connection.Open();
            }
            return _connection;
        }
    }
}