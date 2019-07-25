using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace BookSys.ViewModel.ViewModels
{
    public class AuthorVM
    {
        public long ID { get; set; }

        public Guid MyGuid { get; set; }

        [Required]
        [StringLength(25, ErrorMessage = "Must be between 2 and 25 characters", MinimumLength = 2)]
        public string FirstName { get; set; }

        public string MiddleName { get; set; }

        [Required]
        [StringLength(25, ErrorMessage = "Must be between 2 and 25 characters", MinimumLength = 2)]
        public string LastName { get; set; }

        public string FullName { get; set; }

        public virtual List<BookAuthorVM> BookAuthors { get; set; }

    }
}
