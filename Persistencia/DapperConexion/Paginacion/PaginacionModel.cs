using System.Collections.Generic;

namespace Persistencia.Paginacion
{
    public class PaginacionModel
    {
        //[{cursoId : "123","titulo":"asp.net"}]
        public List<IDictionary<string, object>> ListaRecords { get; set; }


        public int TotalRecords { get; set; }
        public int numeroPaginas { get; set; }


    }
}