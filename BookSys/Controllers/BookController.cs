using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BookSys.BLL.Contracts;
using BookSys.BLL.Services;
using BookSys.ViewModel.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookSys.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : Controller
    {
        private readonly IGenericService<BookVM, long> bookService;

        public BookController(BookService _bookService)
        {
            bookService =_bookService;
        }

        // api/Book/Create
        [HttpPost("[action]")]
        public ActionResult<ResponseVM> Create([FromBody]BookVM bookVM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Something went wrong");
            }
            return bookService.Create(bookVM);
        }

        // api/Book/Delete/id
        [HttpDelete("[action]/{id}")]
        public ActionResult<ResponseVM> Delete(long id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Something went wrong");
            }
            return bookService.Delete(id);
        }

        // api/Book/GetAll
        [HttpGet("[action]")]
        public IEnumerable<BookVM> GetAll()
        {
            return bookService.GetAll();
        }

        // api/Book/GetSingleBy/id
        [HttpGet("[action]/{id}")]
        public BookVM GetSingleBy(string id)
        {
            return bookService.GetSingleBy(id);
        }

        // api/Book/Update
        [HttpPut("[action]")]
        public ActionResult<ResponseVM> Update([FromBody]BookVM bookVM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Something went wrong");
            }
            return bookService.Update(bookVM);
        }


        [HttpPost("[action]")]
        public ActionResult<PagingResponse<BookVM>> GetDataServerSide([FromBody]PagingRequest paging)
        {
            return bookService.GetDataServerSide(paging);
        }
    }
}