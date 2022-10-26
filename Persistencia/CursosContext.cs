
using Dominio;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistencia

{
    public class CursosContext : IdentityDbContext<Usuario>
    {

        //puente de la inyeccion de dependencias
        //Sirve para realizar futuras migraciones de entidades
        public CursosContext(DbContextOptions options) : base(options)
        {
        }
        /*Definir cuando una entidad tiene multiples llaves primarias*/
        /*
        protected override void OnModelCreating(ModelBuilder modelBuilder){
            //Crear el archivo de migracion
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<CursoInstructor>().HasKey(ci => new {ci.InstructorId, ci.CursoId});
        }
        */
        /*
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
        */
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<CursoInstructor>().HasKey(ci => new { ci.InstructorId, ci.CursoId });
            
        }


        //clases a entidades db
        public DbSet<Comentario> Comentario { get; set; }
        public DbSet<Curso> Curso { get; set; }
        public DbSet<CursoInstructor> CursoInstructor { get; set; }
        public DbSet<Instructor> Instructor { get; set; }
        public DbSet<Precio> Precio { get; set; }
        public DbSet<Documento> Documento { get; set; }
        


    }
}