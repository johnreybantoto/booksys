using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace BookSys.ViewModel.ViewModels
{
    public class Column
    {

        [JsonProperty(PropertyName = "data")]
        public string Data { get; set; }

        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }

        [JsonProperty(PropertyName = "searchable")]
        public bool Searchable { get; set; }

        [JsonProperty(PropertyName = "orderable")]
        public bool Orderable { get; set; }

        [JsonProperty(PropertyName = "search")]
        public Search Search { get; set; }
    }

    public class Order
    {
        [JsonProperty(PropertyName = "column")]
        public int Column { get; set; }
        [JsonProperty(PropertyName = "dir")]
        public string Dir { get; set; }
    }
    public class PagingRequest
    {
        [JsonProperty(PropertyName = "draw")]
        public int Draw { get; set; }
        [JsonProperty(PropertyName = "columns")]
        public IList<Column> Columns { get; set; }
        [JsonProperty(PropertyName = "order")]
        public IList<Order> Order { get; set; }
        [JsonProperty(PropertyName = "start")]
        public int Start { get; set; }
        [JsonProperty(PropertyName = "length")]
        public int Length { get; set; }
        [JsonProperty(PropertyName = "search")]
        public Search Search { get; set; }
    }

    public class PagingResponse<TVM> where TVM : class
    {
        [JsonProperty(PropertyName = "draw")]
        public int Draw { get; set; }
        [JsonProperty(PropertyName = "recordsFiltered")]
        public int RecordsFiltered { get; set; }
        [JsonProperty(PropertyName = "recordsTotal")]
        public int RecordsTotal { get; set; }
       
        [JsonProperty(PropertyName = "data")]
        public IEnumerable<TVM> Reponse { get; set; }
    }

    public class Search
    {
        [JsonProperty(PropertyName = "value")]
        public string Value { get; set; }
        [JsonProperty(PropertyName = "regex")]
        public bool Regex { get; set; }
    }

    public class SearchCriteria
    {
        [JsonProperty(PropertyName = "filter")]
        public string Filter { get; set; }
        [JsonProperty(PropertyName = "isPageLoad")]
        public bool IsPageLoad { get; set; }
    }
}
