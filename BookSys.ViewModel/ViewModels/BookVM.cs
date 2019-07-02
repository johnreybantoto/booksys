using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace BookSys.ViewModel.ViewModels
{
    public class BookVM
    {
        public long ID { get; set; }

        public Guid MyGuid { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public int Copyright { get; set; }
    }
}
