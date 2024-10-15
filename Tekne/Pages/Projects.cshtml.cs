using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using ProjectManager;
using System.IO;

namespace Tekne.Pages
{
    public class ProjectsModel : PageModel
    {
        LstProjects projects;

        public void OnGet()
        {
            //ViewData[]
            projects = new LstProjects();
            string base_path = Directory.GetCurrentDirectory();
            projects.load_json(base_path + "\\DB\\projects.json");
        }

        public void OnPost()
        {
            //ViewData[]
            projects = new LstProjects();
            projects.load_json("/DB/projects.json");
        }
    }
}
