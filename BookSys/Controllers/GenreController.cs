using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BookSys.BLL.Contracts;
using BookSys.BLL.Services;
using BookSys.ViewModel.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GenreSys.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenreController : Controller
    {
        private readonly IGenericService<GenreVM, long> genreService;

        public GenreController(GenreService _genreService)
        {
            genreService =_genreService;
        }

        // api/Genre/Create
        [HttpPost("[action]")]
        public ActionResult<ResponseVM> Create([FromBody]GenreVM genreVM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Something went wrong");
            }
            return genreService.Create(genreVM);
        }

        // api/Genre/Delete/id
        [HttpDelete("[action]/{id}")]
        public ActionResult<ResponseVM> Delete(long id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Something went wrong");
            }
            return genreService.Delete(id);
        }

        // api/Genre/GetAll
        [HttpGet("[action]")]
        public IEnumerable<GenreVM> GetAll()
        {
            return genreService.GetAll();
        }

        // api/Genre/GetSingleBy/id
        [HttpGet("[action]/{id}")]
        public GenreVM GetSingleBy(string id)
        {
            return genreService.GetSingleBy(id);
        }

        // api/Genre/Update
        [HttpPut("[action]")]
        public ActionResult<ResponseVM> Update([FromBody]GenreVM genreVM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Something went wrong");
            }
            return genreService.Update(genreVM);
        }


        [HttpPost("[action]")]
        public ActionResult<PagingResponse<GenreVM>> GetDataServerSide([FromBody]PagingRequest paging)
        {
            return genreService.GetDataServerSide(paging);
        }
    }
}