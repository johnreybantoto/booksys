using BookSys.DAL.Models;
using BookSys.ViewModel.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace BookSys.BLL.Helpers
{
    public class ToModel
    {
        public Book Book(BookVM bookVm)
        {
            return new Book
            {
                ID = bookVm.ID,
                MyGuid = bookVm.MyGuid,
                Title = bookVm.Title,
                Copyright = bookVm.Copyright
            };
        }
    }
}
