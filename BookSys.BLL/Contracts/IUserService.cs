﻿using BookSys.ViewModel.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace BookSys.BLL.Contracts
{
    public interface IUserService<TVM, LVM, TType> where TVM : class where LVM : class where TType : IConvertible
    {
        IEnumerable<TVM> GetAll();
        TVM GetSingleBy(string id);
        Task<ResponseVM> Register(TVM entity);
        ResponseVM Delete(string id);
        ResponseVM Update(TVM entity);
        ResponseVM Deactivate(TVM entity);
        Task<ResponseVM> Login(LVM entity);
        ResponseVM Validate(TVM entity);
        Task<TVM> UserProfile(string id);
        Task<ForgotPasswordVM> GetSecurityQuestion(string id);
        Task<ResponseVM> ResetPassword(ForgotPasswordVM entity);
    }
}