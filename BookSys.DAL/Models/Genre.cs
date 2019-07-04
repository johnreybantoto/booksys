using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace BookSys.DAL.Models
{
    public class Genre
    {
        [Key]
        public long ID { get; set; }

        public Guid MyGuid { get; set; }

        public string Name { get; set; }

        public virtual ICollection<Book> Books { get; set; }
    }
}
