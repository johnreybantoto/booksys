﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace BookSys.ViewModel.ViewModels
{
    public class UserVM
    {
        public string ID { get; set; }

        [Required]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(25, ErrorMessage = "Must be between 5 and 25 characters", MinimumLength = 5)]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required]
        public string FirstName { get; set; }

        public string MiddleName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        public string Role { get; set; }
    }
}
