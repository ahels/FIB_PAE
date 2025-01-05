using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using ProjectManager;
using HtmlParser;
using System.Data;
using System.IO;

namespace Tekne.Pages
{
    public class SimulatorModel : PageModel
    {
        LstProjects projects;

        public void OnGet()
        {
            //projects = new LstProjects();
            //string base_path = Directory.GetCurrentDirectory();
            //projects.load_json(base_path + "\\DB\\projects.json");
            //DataTable dt_prjs = projects.to_datatable();
            //HtmlTable tbl = new HtmlTable("main-table", "test", dt_prjs);

            //ViewData["Title"] = "Projects";
            //ViewData["Table"] = tbl.to_html();
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
