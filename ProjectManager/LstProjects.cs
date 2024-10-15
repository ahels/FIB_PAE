using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace ProjectManager
{
    public class LstProjects
    {
        const string FORMAT_TIME = "yyyy/MM/dd HH:mm:ss";
        List<Project> projects;

        public LstProjects() { 
            projects = new List<Project>();
        }

        public bool load_json(string path)
        {
            string file = File.ReadAllText(path);
            JObject json = JObject.Parse(file);

            projects = new List<Project>(json["projects"].Count());

            foreach (JObject prj in json["projects"])
            {
                DateTime date_create = DateTime.ParseExact(prj["date_create"].ToString(), FORMAT_TIME, CultureInfo.InvariantCulture);
                DateTime date_update = DateTime.ParseExact(prj["date_update"].ToString(), FORMAT_TIME, CultureInfo.InvariantCulture);

                Project p = new Project((int)prj["id"], prj["name"].ToString(), date_create, date_update, (State)(int)prj["state"]);
                projects.Add(p);
            }

            return true;
        }
    }
}
