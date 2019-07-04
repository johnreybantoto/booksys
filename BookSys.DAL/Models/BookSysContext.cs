using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace BookSys.DAL.Models
{
    public class BookSysContext : DbContext
    {
        public BookSysContext(DbContextOptions<BookSysContext> options) : base(options)
        {

        }

        public DbSet<Book> Books { get; set; }
        public DbSet<Genre> Genres { get; set; }
    }
}
