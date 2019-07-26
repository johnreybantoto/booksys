using BookSys.BLL.Contracts;
using BookSys.BLL.Helpers;
using BookSys.DAL.Models;
using BookSys.ViewModel.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BookSys.BLL.Services
{
    public class BookService : IGenericService<BookVM, long>
    {
        private readonly ToViewModel toViewModel = new ToViewModel();
        private readonly ToModel toModel = new ToModel();
        private readonly BookSysContext context;

        // inject dependencies
        public BookService(BookSysContext _context)
        {
            context = _context;
        }

        public ResponseVM Create(BookVM bookVM)
        {
            using (context)
            {
                using(var dbTransaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        bookVM.MyGuid = Guid.NewGuid();
                        // saves the book first then assign the entity to bookSaved where we will get the generated id
                        var bookSaved = context.Books.Add(toModel.Book(bookVM)).Entity;
                        context.SaveChanges();

                        foreach (var authID in bookVM.AuthorIdList)
                        {
                            // validates existence of author
                            var author = context.Authors.Find(authID);
                            if (author == null)
                                return new ResponseVM("created", false, "Book", "Author does not exists");
                            // saves to bookauthor
                            var bookAuthor = new BookAuthor
                            {
                                AuthorID = authID,
                                BookID = bookSaved.ID,
                                AuthorFullName = $"{author.FirstName}{ (string.IsNullOrEmpty(author.MiddleName) ? "" : " " + author.MiddleName) }{(string.IsNullOrEmpty(author.LastName) ? "" : " " + author.LastName)}"
                            };
                            context.BookAuthors.Add(bookAuthor);
                            context.SaveChanges();
                        }

                        // commits changes to db
                        dbTransaction.Commit();
                        return new ResponseVM("created", true, "Book");
                    }
                    catch (Exception ex)
                    {
                        // rollback any changes
                        dbTransaction.Rollback();
                        return new ResponseVM("created", false, "Book", ResponseVM.SOMETHING_WENT_WRONG, "", ex);
                    }
                }
            }
        }
        public ResponseVM Delete(long id)
        {
            using (context)
            {
                using (var dbTransaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        Book bookToBeDeleted = context.Books.Find(id);
                        if (bookToBeDeleted == null)
                        {
                            return new ResponseVM("deleted", false, "Book", ResponseVM.DOES_NOT_EXIST);
                        }

                        var bookRemoveFromBookAuthors = context.BookAuthors.Where(x => x.BookID == bookToBeDeleted.ID);
                        context.BookAuthors.RemoveRange(bookRemoveFromBookAuthors);
                        context.SaveChanges();

                        // delete from database
                        context.Books.Remove(bookToBeDeleted);
                        context.SaveChanges();

                        dbTransaction.Commit();
                        return new ResponseVM("deleted", true, "Book");
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        return new ResponseVM("deleted", false, "Book", ResponseVM.SOMETHING_WENT_WRONG, "", ex);
                    }
                }
            }
        }

        public IEnumerable<BookVM> GetAll()
        {
            using (context)
            {
                using (var dbTransaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        // gets all books record and order from highest to lowest
                        var books = context.Books
                                           .Include(x => x.Genre)
                                           .Include(x => x.BookAuthors)
                                           .ThenInclude(x => x.Author)
                                           .ToList()
                                           .OrderByDescending(x => x.ID);
                        var booksVm = books.Select(x => toViewModel.Book(x));
                        return booksVm;
                    }
                    catch (Exception)
                    {
                        throw;
                    }
                }
            }
        }

        public BookVM GetSingleBy(string guid)
        {
            using (context)
            {
                using (var dbTransaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        // returns one record based on passed id
                        var book = context.Books
                                        .Include( x => x.Genre)
                                        .Include(x => x.BookAuthors)
                                        .ThenInclude(x => x.Author)
                                        .Where(x => x.MyGuid.ToString() == guid)
                                        .FirstOrDefault();
                        BookVM bookVm = null;
                        if(book != null)
                            bookVm = toViewModel.Book(book);

                        return bookVm;
                    }
                    catch (Exception)
                    {
                        throw;
                    }
                }
            }
        }

        public ResponseVM Update(BookVM bookVM)
        {
            using (context)
            {
                using (var dbTransaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        // find the book from the database
                        Book bookToBeUpdated = context.Books.Find(bookVM.ID);
                        // ends function then return error message
                        if(bookToBeUpdated == null)
                        {
                            return new ResponseVM("updated", false, "Book", ResponseVM.DOES_NOT_EXIST);
                        }

                        // update changes
                        bookToBeUpdated.Title = bookVM.Title;
                        bookToBeUpdated.Copyright = bookVM.Copyright;
                        bookToBeUpdated.GenreID = bookVM.GenreID;

                        // remove all first before updating
                        var bookRemoveFromBookAuthors = context.BookAuthors.Where(x => x.BookID == bookToBeUpdated.ID);
                        context.BookAuthors.RemoveRange(bookRemoveFromBookAuthors);
                        context.SaveChanges();

                        foreach (var authID in bookVM.AuthorIdList)
                        {
                            // validates existence of author // validates existence of author
                            var author = context.Authors.Find(authID);
                            if (author == null)
                                return new ResponseVM("updated", false, "Book", "Author does not exists");
                            // saves to bookauthor
                            var bookAuthor = new BookAuthor
                            {
                                AuthorID = authID,
                                BookID = bookToBeUpdated.ID,
                                AuthorFullName = $"{author.FirstName}{ (string.IsNullOrEmpty(author.MiddleName) ? "" : " " + author.MiddleName) }{(string.IsNullOrEmpty(author.LastName) ? "" : " " + author.LastName)}"
                            };
                            context.BookAuthors.Add(bookAuthor);
                            context.SaveChanges();
                        }
                        context.SaveChanges();

                        dbTransaction.Commit();
                        return new ResponseVM("updated", true, "Book");
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        return new ResponseVM("updated", false, "Book", ResponseVM.SOMETHING_WENT_WRONG, "", ex);
                    }
                }
            }
        }

        public PagingResponse<BookVM> GetDataServerSide(PagingRequest paging)
        {
            using (context)
            {
                var pagingResponse = new PagingResponse<BookVM>()
                {
                    // counts how many times the user draws data
                    Draw = paging.Draw
                };
                // initialized query
                IEnumerable<Book> query = null;
                // search if user provided a search value, i.e. search value is not empty
                if (!string.IsNullOrEmpty(paging.Search.Value))
                {
                    // search based from the search value     
                    query = context.Books.Include(x => x.Genre)
                                         .Include(x => x.BookAuthors)
                                         .ThenInclude(x => x.Author)
                                         .Where(v => v.Title.ToString().ToLower().Contains(paging.Search.Value.ToLower()) || 
                                                     v.Copyright.ToString().ToLower().Contains(paging.Search.Value.ToLower()) ||
                                                     v.Genre.Name.ToString().ToLower().Contains(paging.Search.Value.ToLower()) ||
                                                     v.BookAuthors.Any(x => x.AuthorFullName.ToLower().Contains(paging.Search.Value.ToLower())));
                }
                else
                {
                    // selects all from table
                    query = context.Books
                                        .Include(x => x.Genre)
                                        .Include(x => x.BookAuthors)
                                        .ThenInclude(x => x.Author);
                }
                // total records from query
                var recordsTotal = query.Count();
                // orders the data by the sorting selected by the user
                // used ternary operator to determine if ascending or descending
                var colOrder = paging.Order[0];
                switch (colOrder.Column)
                {
                    case 0:
                        query = colOrder.Dir == "asc" ? query.OrderBy(v => v.Title) : query.OrderByDescending(v => v.Title);
                        break;
                    case 1:
                        query = colOrder.Dir == "asc" ? query.OrderBy(b => b.Copyright) : query.OrderByDescending(b => b.Copyright);
                        break;
                    case 2:
                        query = colOrder.Dir == "asc" ? query.OrderBy(b => b.Genre.Name) : query.OrderByDescending(b => b.Genre.Name);
                        break;
                }
                var taken = query.Skip(paging.Start).Take(paging.Length).ToArray();
                // converts model(query) into viewmodel then assigns it to response which is displayed as "data"
                pagingResponse.Reponse = taken.Select(x => toViewModel.Book(x));
                pagingResponse.RecordsTotal = recordsTotal;
                pagingResponse.RecordsFiltered = recordsTotal;

                return pagingResponse;
            }
        }

    }
}
