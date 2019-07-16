using BookSys.BLL.Contracts;
using BookSys.BLL.Helpers;
using BookSys.DAL.Models;
using BookSys.ViewModel.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BookSys.BLL.Services
{
    public class UserService : IUserService<UserVM, LoginVM, string>
    {
        private readonly ToViewModel toViewModel;
        private readonly ToModel toModel;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ApplicationSettingsVM _applicationSettings;

        // inject dependencies
        public UserService(UserManager<User> userManager, SignInManager<User> signInManager, IOptions<ApplicationSettingsVM> appSettings)
        {
            toViewModel = new ToViewModel();
            toModel = new ToModel();
            _userManager = userManager;
            _signInManager = signInManager;
            _applicationSettings = appSettings.Value;
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
                // save user and encrypts password
                var result = await _userManager.CreateAsync(user, userVM.Password);
                // save user role
                await _userManager.AddToRoleAsync(user, userVM.Role);
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

        public async Task<ResponseVM> Login(LoginVM loginVM)
        {
            var user = await _userManager.FindByNameAsync(loginVM.UserName);
            var userFound = await _userManager.CheckPasswordAsync(user, loginVM.Password);
            if (user != null && userFound)
            {
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim("UserID",user.Id.ToString()),
                    }),
                    Expires = DateTime.UtcNow.AddDays(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_applicationSettings.JWT_Secret)), SecurityAlgorithms.HmacSha256Signature)
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                var token = tokenHandler.WriteToken(securityToken);
                return new ResponseVM("authenticated", true, "User", "Login succcess!", token);
            }
            else
                return new ResponseVM("authenticated", false, "User", "Username or password is incorrect.");
        }

        public ResponseVM Deactivate(UserVM userVM)
        {
            return null;
        }

        public ResponseVM Validate(UserVM userVM)
        {
            return null;
        }

        public async Task<UserVM> UserProfile(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            var userVm = toViewModel.User(user);
            return userVm;
        }
    }
}
