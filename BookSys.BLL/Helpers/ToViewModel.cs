using BookSys.DAL.Models;
using BookSys.ViewModel.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
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
                Genre = Genre(book.Genre),
                Authors = BookAuthor(book.BookAuthors),
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

        public UserVM User(User user)
        {
            return new UserVM
            {
                FirstName = user.FirstName,
                MiddleName = user.MiddleName,
                LastName = user.LastName,
                UserName = user.UserName
            };
        }

        public AuthorVM Author(Author author)
        {
            return new AuthorVM
            {
                ID = author.ID,
                MyGuid = author.MyGuid,
                FirstName = author.FirstName,
                MiddleName = author.MiddleName,
                LastName = author.LastName,
                FullName = ToFullName(author.FirstName, author.MiddleName, author.LastName)
            };
        }
        public string ToFullName(string firstName, string middleName, string lastName)
        {
            return $"{firstName}{ (string.IsNullOrEmpty(middleName) ? "" : " " + middleName) }{(string.IsNullOrEmpty(lastName) ? "" : " " + lastName)}";
        }

        // converts List<BookAuthor> to List<BookAuthorVM>
        private List<AuthorVM> BookAuthor(List<BookAuthor> bookAuthor)
        {
            // to do: used lambda and linq
            List<AuthorVM> authorLists = new List<AuthorVM>();
            if (bookAuthor != null)
            {
               foreach(var ba in bookAuthor)
                {
                    var author = Author(ba.Author);
                    authorLists.Add(author);
                }
            } else
            {
                authorLists = null;
            }
            return authorLists;
        }

       
    }
}
