using BookSys.ViewModel.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace BookSys.BLL.Contracts
{
    public interface IUserService<TVM, TType> where TVM : class where TType : IConvertible
    {
        IEnumerable<TVM> GetAll();
        TVM GetSingleBy(string id);
        Task<ResponseVM> Register(TVM entity);
        ResponseVM Delete(string id);
        ResponseVM Update(TVM entity);
        ResponseVM Deactivate(TVM entity);
        ResponseVM Login(TVM entity);
        ResponseVM Validate(TVM entity);
    }
}