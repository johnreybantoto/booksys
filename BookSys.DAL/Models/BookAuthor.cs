using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace BookSys.DAL.Models
{
    public class BookAuthor
    {
        [Key]
        public long ID { get; set; }

        public long BookID { get; set; }
        public Book Book { get; set; }


        public long AuthorID { get; set; }
        public Author Author { get; set; }

        public string AuthorFullName { get; set; }
    }
}
