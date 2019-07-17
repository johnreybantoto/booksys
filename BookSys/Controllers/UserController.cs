using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BookSys.BLL.Contracts;
using BookSys.BLL.Services;
using BookSys.ViewModel.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookSys.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : Controller
    {
        private readonly IUserService<UserVM, LoginVM, string> userService;

        public UserController(UserService _userService)
        {
            userService = _userService;
        }

        [HttpPost("[action]")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ResponseVM>> Register([FromBody] UserVM userVM)
        {
            if (ModelState.IsValid)
            {
                var res = await userService.Register(userVM);
                return Ok(res);
            }
            else
                return BadRequest("Something went wrong");
        }


        [HttpPost("[action]")]
        [AllowAnonymous]
        public async Task<ActionResult<ResponseVM>> Login([FromBody] LoginVM loginVM)
        {
            if (ModelState.IsValid)
            {
                var res = await userService.Login(loginVM);
                if (res.IsSuccess)
                    return Ok(res);
                else
                    return BadRequest(res);
            }
            else
                return BadRequest("Something went wrong");
        }

        [HttpGet("[action]")]
        public async Task<UserVM> UserProfile()
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            return await userService.UserProfile(userId);
        }

        [HttpGet("[action]")]
        [Authorize(Roles ="Admin")]
        public string ForAdmin()
        {
            return "For Admin";
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "Clerk")]
        public string ForClerk()
        {
            return "For Clerk";
        }


        [HttpGet("[action]")]
        [Authorize(Roles = "Admin,Clerk")]
        public string ForAdminOrClerk()
        {
            return "For Admin or Clerk";
        }
    }
}