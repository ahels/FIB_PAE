using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using ProjectManager;
using HtmlParser;
using System.Data;
using System.IO;

namespace Tekne.Pages
{
    public class EditorModel : PageModel
    {

        public void OnGet()
        {
        }

        //public void OnPost()
        //{
        //    //ViewData[]
        //    projects = new LstProjects();
        //    projects.load_json("/DB/projects.json");
        //    DataTable dt_prjs = projects.to_datatable();
        //    HtmlTable tbl = new HtmlTable("test", "test", dt_prjs);
        //}
    }
}
