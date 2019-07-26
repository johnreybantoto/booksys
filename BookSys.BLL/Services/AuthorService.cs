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
    public class AuthorService : IGenericService<AuthorVM, long>
    {
        private readonly ToViewModel toViewModel = new ToViewModel();
        private readonly ToModel toModel = new ToModel();
        private readonly BookSysContext context;

        // inject dependencies
        public AuthorService(BookSysContext _context)
        {
            context = _context;
        }

        public ResponseVM Create(AuthorVM authorVM)
        {
            using (context)
            {
                using(var dbTransaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        // toModel.Author(authorVM) == converts to Author type then save to context
                        authorVM.MyGuid = Guid.NewGuid();
                        context.Authors.Add(toModel.Author(authorVM));
                        context.SaveChanges();

                        // commits changes to db
                        dbTransaction.Commit();
                        return new ResponseVM("created", true, "Author");
                    }
                    catch (Exception ex)
                    {
                        // rollback any changes
                        dbTransaction.Rollback();
                        return new ResponseVM("created", false, "Author", ResponseVM.SOMETHING_WENT_WRONG, "", ex);
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
                        Author authorToBeDeleted = context.Authors.Find(id);
                        if (authorToBeDeleted == null)
                        {
                            return new ResponseVM("deleted", false, "Author", ResponseVM.DOES_NOT_EXIST);
                        }
                        // delete from database
                        context.Authors.Remove(authorToBeDeleted);
                        context.SaveChanges();

                        dbTransaction.Commit();
                        return new ResponseVM("deleted", true, "Author");
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        return new ResponseVM("deleted", false, "Author", ResponseVM.SOMETHING_WENT_WRONG, "", ex);
                    }
                }
            }
        }

        public IEnumerable<AuthorVM> GetAll()
        {
            using (context)
            {
                using (var dbTransaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        // gets all authors record and order from highest to lowest
                        var authors = context.Authors.ToList().OrderByDescending(x => x.ID);
                        var authorsVm = authors.Select(x => toViewModel.Author(x));
                        return authorsVm;
                    }
                    catch (Exception)
                    {
                        throw;
                    }
                }
            }
        }

        public AuthorVM GetSingleBy(string guid)
        {
            using (context)
            {
                using (var dbTransaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        // returns one record based on passed id
                        var author = context.Authors
                                        .Where(x => x.MyGuid.ToString() == guid)
                                        .FirstOrDefault();
                        AuthorVM authorVm = null;
                        if(author != null)
                            authorVm = toViewModel.Author(author);

                        return authorVm;
                    }
                    catch (Exception)
                    {
                        throw;
                    }
                }
            }
        }

        public ResponseVM Update(AuthorVM authorVM)
        {
            using (context)
            {
                using (var dbTransaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        // find the author from the database
                        Author authorToBeUpdated = context.Authors.Find(authorVM.ID);
                        // ends function then return error message
                        if(authorToBeUpdated == null)
                        {
                            return new ResponseVM("updated", false, "Author", ResponseVM.DOES_NOT_EXIST);
                        }

                        // update changes
                        authorToBeUpdated.FirstName = authorVM.FirstName;
                        authorToBeUpdated.LastName = authorVM.LastName;
                        authorToBeUpdated.MiddleName = authorVM.MiddleName;
                        context.SaveChanges();

                        dbTransaction.Commit();
                        return new ResponseVM("updated", true, "Author");
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        return new ResponseVM("updated", false, "Author", ResponseVM.SOMETHING_WENT_WRONG, "", ex);
                    }
                }
            }
        }

        public PagingResponse<AuthorVM> GetDataServerSide(PagingRequest paging)
        {
            using (context)
            {

                var pagingResponse = new PagingResponse<AuthorVM>()
                {
                    // counts how many times the user draws data
                    Draw = paging.Draw
                };
                // initialized query
                IEnumerable<Author> query = null;
                // search if user provided a search value, i.e. search value is not empty
                if (!string.IsNullOrEmpty(paging.Search.Value))
                {
                    // search based from the search value
                    query = context.Authors.Where(v => v.FirstName.ToString().ToLower().Contains(paging.Search.Value.ToString().ToLower()));
                }
                else
                {
                    // selects all from table
                    query = context.Authors;
                }
                // total records from query
                var recordsTotal = query.Count();
                // orders the data by the sorting selected by the user
                // used ternary operator to determine if ascending or descending
                var colOrder = paging.Order[0];
                switch (colOrder.Column)
                {
                    case 0:
                        query = colOrder.Dir == "asc" ? query.OrderBy(v => v.FirstName) : query.OrderByDescending(v => v.FirstName);
                        break;
                }

                var taken = query.Skip(paging.Start).Take(paging.Length).ToArray();
                // converts model(query) into viewmodel then assigns it to response which is displayed as "data"
                pagingResponse.Reponse = taken.Select(x => toViewModel.Author(x));
                pagingResponse.RecordsTotal = recordsTotal;
                pagingResponse.RecordsFiltered = recordsTotal;

                return pagingResponse;
            }
        }

    }
}
