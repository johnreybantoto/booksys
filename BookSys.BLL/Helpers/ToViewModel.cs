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
                Copyright = book.Copyright,
                GenreID = book.GenreID,
                Genre = Genre(book.Genre)
            };
        }

        public GenreVM Genre(Genre genre)
        {
            return new GenreVM
            {
                ID = genre.ID,
                MyGuid = genre.MyGuid,
                Name = genre.Name
            };
        }
    }
}
