using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BookSys.BLL.Contracts;
using BookSys.BLL.Services;
using BookSys.ViewModel.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AuthorSys.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorController : Controller
    {
        private readonly IGenericService<AuthorVM, long> authorService;

        public AuthorController(AuthorService _authorService)
        {
            authorService =_authorService;
        }

        // api/Author/Create
        [HttpPost("[action]")]
        public ActionResult<ResponseVM> Create([FromBody]AuthorVM authorVM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Something went wrong");
            }
            return authorService.Create(authorVM);
        }

        // api/Author/Delete/id
        [HttpDelete("[action]/{id}")]
        public ActionResult<ResponseVM> Delete(long id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Something went wrong");
            }
            return authorService.Delete(id);
        }

        // api/Author/GetAll
        [HttpGet("[action]")]
        public IEnumerable<AuthorVM> GetAll()
        {
            return authorService.GetAll();
        }

        // api/Author/GetSingleBy/id
        [HttpGet("[action]/{id}")]
        public AuthorVM GetSingleBy(long id)
        {
            return authorService.GetSingleBy(id);
        }

        // api/Author/Update
        [HttpPut("[action]")]
        public ActionResult<ResponseVM> Update([FromBody]AuthorVM authorVM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Something went wrong");
            }
            return authorService.Update(authorVM);
        }


        [HttpPost("[action]")]
        public ActionResult<PagingResponse<AuthorVM>> GetDataServerSide([FromBody]PagingRequest paging)
        {
            return authorService.GetDataServerSide(paging);
        }
    }
}