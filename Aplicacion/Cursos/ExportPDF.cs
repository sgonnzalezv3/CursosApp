using System.IO;
using System.Threading;
using System.Threading.Tasks;
using iTextSharp.text;
using iTextSharp.text.pdf;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistencia;

namespace Aplicacion.Cursos
{
    public class ExportPDF
    {
        //encargada de conectarse con la web api para comunicarse enviarle resultados y recibir parametros
        public class Consulta : IRequest<Stream> { }
        public class Manejador : IRequestHandler<Consulta, Stream>
        {
            private readonly CursosContext _context;
            public Manejador(CursosContext context)
            {
                _context = context;
            }

            //Stream es la representacion del archivo pdf
            public async Task<Stream> Handle(Consulta request, CancellationToken cancellationToken)
            {
                //agregar la fuente indicando el tipo de letra, tamaño, estilo y color
                Font fuenteTitulo = new Font(Font.HELVETICA, 8f, Font.BOLD, BaseColor.Blue);
                Font fuenteHeader = new Font(Font.HELVETICA, 7f, Font.BOLD, BaseColor.Black);
                Font fuenteData = new Font(Font.HELVETICA, 7f, Font.NORMAL, BaseColor.Black);
                //traer todos los cursos de la bd
                var cursos = await _context.Curso.ToListAsync();


                //variable que almacena el string del pdf
                MemoryStream workStream = new MemoryStream();
                //representar el tamaño del pdf
                Rectangle rect = new Rectangle(PageSize.A4);

                //crear el documento definiendo tamaño y margenes
                Document document = new Document(rect, 0, 0, 50, 100);
                //creando el writer para escribir en el documento pasando el objeto documento y el string que representa el tipo de dato
                PdfWriter writer = PdfWriter.GetInstance(document, workStream);

                //posicion para escribir
                writer.CloseStream = false;
                document.Open();
                document.AddTitle("Lista De Cursos");
                //se crea tabla indicando cuantas columnas
                PdfPTable tabla = new PdfPTable(1);
                //porcentaje de ancho
                tabla.WidthPercentage = 90;
                //celda con el titulo y fuente
                PdfPCell celda = new PdfPCell(new Phrase("Lista de Cursos", fuenteTitulo));
                //sin bordes
                celda.Border = Rectangle.NO_BORDER;
                //agregando la celda a la tabla
                tabla.AddCell(celda);
                //Agregarla dentro del documento
                document.Add(tabla);
                //creando tabla
                PdfPTable tablaCursos = new PdfPTable(2);
                //ancho de cada celda
                float[] widths = new float[] { 40, 60 };
                tablaCursos.SetWidthPercentage(widths, rect);
                //celdas
                PdfPCell celdaHeaderTitulo = new PdfPCell(new Phrase("curso", fuenteHeader));
                //agregar la celda
                tablaCursos.AddCell(celdaHeaderTitulo);
                PdfPCell celdaHeaderDescripcion = new PdfPCell(new Phrase("Descripcion", fuenteHeader));
                //agregar la celda
                tablaCursos.AddCell(celdaHeaderDescripcion);

                tablaCursos.WidthPercentage = 90;
                document.Add(tablaCursos);
                foreach(var cursoElemento in cursos){
                    PdfPCell celdaDataTitulo = new PdfPCell(new Phrase(cursoElemento.Titulo,fuenteData));
                    tablaCursos.AddCell(celdaDataTitulo);
                    PdfPCell celdaDataDescripcion = new PdfPCell(new Phrase(cursoElemento.Descripcion,fuenteData));
                    tablaCursos.AddCell(celdaDataDescripcion);
                }

                document.Add(tablaCursos);
                document.Close();
                // pdf a byte(string)
                byte[] byteData = workStream.ToArray();
                //escribir todo el contenido toda la byte data que empieza en 0 hasta la ultima (.length)
                workStream.Write(byteData, 0, byteData.Length);
                //posicion 0 para imprimirse posteriormente
                workStream.Position = 0;
                return workStream;
            }
        }
    }
}