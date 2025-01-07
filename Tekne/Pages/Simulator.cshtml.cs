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

        public IActionResult OnPostSave(string sceneData)
        {
            LstProjects projects = new LstProjects();
            string base_path = Directory.GetCurrentDirectory();
            string path = base_path + "\\DB\\projects.json";

            projects.load_json(path);
            projects.add_project("new", sceneData);
            projects.save_json(path);

            return new JsonResult(new { result = "OnPostSave CALLED" });
        }

    }
}
