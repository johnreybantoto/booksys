using BookSys.BLL.Contracts;
using BookSys.BLL.Helpers;
using BookSys.DAL.Models;
using BookSys.ViewModel.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BookSys.BLL.Services
{
    public class BookService : IGenericService<BookVM, long>
    {
        private ToViewModel toViewModel = new ToViewModel();
        private ToModel toModel = new ToModel();
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
                        // toModel.Book(bookVM) == converts to Book type then save to context
                        bookVM.MyGuid = Guid.NewGuid();
                        context.Books.Add(toModel.Book(bookVM));
                        context.SaveChanges();

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
                        var books = context.Books.ToList().OrderByDescending(x => x.ID);
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

        public BookVM GetSingleBy(long id)
        {
            using (context)
            {
                using (var dbTransaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        // returns one record based on passed id
                        var book = context.Books.Find(id);
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
       
    }
}
