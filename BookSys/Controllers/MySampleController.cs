using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace BookSys.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MySampleController : Controller
    {
        // api/MySample/MyName (case insensitive)
        [HttpGet("[action]")]
        public ActionResult<MyResponse> MyName()
        {
            return Ok(new MyResponse { IsSuccess = true, Message = "Hi! I'm John Rey" });
        }

        // api/MySample/{name}
        [HttpGet("[action]/{name}")]
        public ActionResult<MyResponse> YourName(string name)
        {
            // string interpolation the same as "Hi " + name
            return Ok(new MyResponse { IsSuccess = true, Message = $"Hi {name}" });
        }

        // api/MySample/LegalAge
        [HttpPost("[action]")]
        public ActionResult<MyResponse> LegalAge([FromBody] Person person)
        {
            MyResponse response;
            if (!ModelState.IsValid)
            {
                response = new MyResponse { IsSuccess = false, Message = "Error"  };
                return BadRequest( response );
            }

            if(person.Age < 18)
            {
                response = new MyResponse { IsSuccess = false, Message = "Not legal age"  };
                return BadRequest(response);

            } else if (!person.Name.ToLower().Contains("x")){
                response = new MyResponse { IsSuccess = false, Message = "x is not found in the name string" };
                return NotFound(response);
            }

            response = new MyResponse { IsSuccess = true, Message = "Success" };
            return Ok(response);
        }

        public class Person
        {
            // more on data annotations later which can be displayed error message in ModelState.IsValid
            [Required]
            [RegularExpression("^[a-zA-Z0-9_]*$", ErrorMessage ="No special characters allowed")]
            public string Name { get; set; }

            [Required]
            [Range(18, 90, ErrorMessage = "Age should be between 18 to 90!")]
            public int Age { get; set; }
        }

        public class MyResponse
        {
            public bool IsSuccess { get; set; }
            public string Message { get; set; }
        }
    }
}