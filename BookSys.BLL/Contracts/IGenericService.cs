using BookSys.ViewModel.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace BookSys.BLL.Contracts
{
    public interface IGenericService<TVM, TType> where TVM : class where TType : IConvertible
    {
        IEnumerable<TVM> GetAll();
        TVM GetSingleBy(string guid);
        ResponseVM Create(TVM entity);
        ResponseVM Delete(TType guid);
        ResponseVM Update(TVM entity);
        PagingResponse<TVM> GetDataServerSide(PagingRequest paging);
    }
}