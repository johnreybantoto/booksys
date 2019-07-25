using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace BookSys.DAL.Models
{
    public class Book
    {
        [Key]
        public long ID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid MyGuid { get; set; }

        public string Title { get; set; }

        public int Copyright { get; set; }

        [ForeignKey("Genre")]
        public long GenreID { get; set; }
        public Genre Genre { get; set; }

        public List<BookAuthor> BookAuthors { get; set; }
    }
}
