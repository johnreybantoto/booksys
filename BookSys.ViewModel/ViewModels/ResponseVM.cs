using System;
using System.Collections.Generic;
using System.Text;

namespace BookSys.ViewModel.ViewModels
{
    public class ResponseVM
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public string Identifier { get; set; }
        public Exception ExceptionError { get; set; }
        public IEnumerable<object> Errors { get; set; }

        public ResponseVM(string action, bool isSuccess, string entity, string msg = "", string identifier = "", Exception exception = null, IEnumerable<object> error = null)
        {
            IsSuccess = isSuccess;
            if (isSuccess)
            {
                Message = $"{entity} was successfully {action}. {msg}";
                Identifier = identifier;
            }
            else
            {
                Message = $"{entity} was unsuccessfully {action}. {msg}";
                ExceptionError = exception;
                if (identifier != null)
                    Identifier = identifier;
                if (error != null)
                {
                    Errors = error;
                }
            }
        }

        public static string SOMETHING_WENT_WRONG { get { return "Something went wrong! Please try again."; } }
        public static string DOES_NOT_EXIST { get { return "It does not exists! It might have been deleted or edited by other user, try refreshing the page!"; } }
        public static string ALREADY_EXIST { get { return "It already exists!"; } }
        public static string NO_NEW_DATA { get { return "You did not update anything! Sent data is the same as the previous data!"; } }
    }
}
