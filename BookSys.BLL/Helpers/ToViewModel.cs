using BookSys.DAL.Models;
using BookSys.ViewModel.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace BookSys.BLL.Helpers
{
    public class ToViewModel
    {
        public BookVM Book(Book book)
        {
            return new BookVM
            {
                ID = book.ID,
                MyGuid = book.MyGuid,
                Title = book.Title,
                Copyright = book.Copyright
            };
        }
    }
}
