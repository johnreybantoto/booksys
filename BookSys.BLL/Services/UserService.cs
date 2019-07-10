using BookSys.BLL.Contracts;
using BookSys.BLL.Helpers;
using BookSys.DAL.Models;
using BookSys.ViewModel.ViewModels;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookSys.BLL.Services
{
    public class UserService : IUserService<UserVM, string>
    {
        private ToViewModel toViewModel = new ToViewModel();
        private ToModel toModel = new ToModel();
        private UserManager<User> _userManager;
        private SignInManager<User> _signInManager;

        // inject dependencies
        public UserService(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<ResponseVM> Register(UserVM userVM)
        {
            var user = new User()
            {
                UserName = userVM.UserName,
                FirstName = userVM.FirstName,
                MiddleName = userVM.MiddleName,
                LastName = userVM.LastName,
            };
            try
            {
                var result = await _userManager.CreateAsync(user, userVM.Password);
                if(result.Succeeded)
                    return new ResponseVM("created", true, "User");
                else
                    return new ResponseVM("created", false, "User", "", "", null, result.Errors);

            }
            catch (Exception ex)
            {
                return new ResponseVM("created", false, "User", ResponseVM.SOMETHING_WENT_WRONG, "", ex);
            }
        }

        public ResponseVM Delete(string id)
        {
            return null;
        }

        public ResponseVM Update(UserVM userVM)
        {
            return null;
        }

        public IEnumerable<UserVM> GetAll()
        {
            return null;
        }

        public UserVM GetSingleBy(string id)
        {
            return null;
        }

        public ResponseVM Login(UserVM userVM)
        {
            return null;
        }

        public ResponseVM Deactivate(UserVM userVM)
        {
            return null;
        }

        public ResponseVM Validate(UserVM userVM)
        {
            return null;
        }
    }
}
