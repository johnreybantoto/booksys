using System;
using System.Collections.Generic;
using System.Text;

namespace BookSys.ViewModel.ViewModels
{
    public class BookAuthorVM
    {
        public long ID { get; set; }

        public long BookID { get; set; }
        public BookVM Book { get; set; }

        public long AuthorID { get; set; }
        public AuthorVM Author { get; set; }

        public string AuthorFullName { get; set; }
    }
}
