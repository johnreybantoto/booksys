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
    public class GenreService : IGenericService<GenreVM, long>
    {
        private ToViewModel toViewModel = new ToViewModel();
        private ToModel toModel = new ToModel();
        private readonly BookSysContext context;

        // inject dependencies
        public GenreService(BookSysContext _context)
        {
            context = _context;
        }

        public ResponseVM Create(GenreVM genreVM)
        {
            using (context)
            {
                using(var dbTransaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        // toModel.Genre(genreVM) == converts to Genre type then save to context
                        genreVM.MyGuid = Guid.NewGuid();
                        context.Genres.Add(toModel.Genre(genreVM));
                        context.SaveChanges();

                        // commits changes to db
                        dbTransaction.Commit();
                        return new ResponseVM("created", true, "Genre");
                    }
                    catch (Exception ex)
                    {
                        // rollback any changes
                        dbTransaction.Rollback();
                        return new ResponseVM("created", false, "Genre", ResponseVM.SOMETHING_WENT_WRONG, "", ex);
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
                        Genre genreToBeDeleted = context.Genres.Find(id);
                        if (genreToBeDeleted == null)
                        {
                            return new ResponseVM("deleted", false, "Genre", ResponseVM.DOES_NOT_EXIST);
                        }
                        // delete from database
                        context.Genres.Remove(genreToBeDeleted);
                        context.SaveChanges();

                        dbTransaction.Commit();
                        return new ResponseVM("deleted", true, "Genre");
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        return new ResponseVM("deleted", false, "Genre", ResponseVM.SOMETHING_WENT_WRONG, "", ex);
                    }
                }
            }
        }

        public IEnumerable<GenreVM> GetAll()
        {
            using (context)
            {
                using (var dbTransaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        // gets all genres record and order from highest to lowest
                        var genres = context.Genres.ToList().OrderByDescending(x => x.ID);
                        var genresVm = genres.Select(x => toViewModel.Genre(x));
                        return genresVm;
                    }
                    catch (Exception)
                    {
                        throw;
                    }
                }
            }
        }

        public GenreVM GetSingleBy(long id)
        {
            using (context)
            {
                using (var dbTransaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        // returns one record based on passed id
                        var genre = context.Genres.Find(id);
                        GenreVM genreVm = null;
                        if(genre != null)
                            genreVm = toViewModel.Genre(genre);

                        return genreVm;
                    }
                    catch (Exception)
                    {
                        throw;
                    }
                }
            }
        }

        public ResponseVM Update(GenreVM genreVM)
        {
            using (context)
            {
                using (var dbTransaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        // find the genre from the database
                        Genre genreToBeUpdated = context.Genres.Find(genreVM.ID);
                        // ends function then return error message
                        if(genreToBeUpdated == null)
                        {
                            return new ResponseVM("updated", false, "Genre", ResponseVM.DOES_NOT_EXIST);
                        }

                        // update changes
                        genreToBeUpdated.Name = genreVM.Name;
                        context.SaveChanges();

                        dbTransaction.Commit();
                        return new ResponseVM("updated", true, "Genre");
                    }
                    catch (Exception ex)
                    {
                        dbTransaction.Rollback();
                        return new ResponseVM("updated", false, "Genre", ResponseVM.SOMETHING_WENT_WRONG, "", ex);
                    }
                }
            }
        }
       
    }
}
