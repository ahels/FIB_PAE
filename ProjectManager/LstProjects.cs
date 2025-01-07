using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
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

                Project p = new Project((int)prj["id"], prj["name"].ToString(), date_create, date_update, (State)(int)prj["state"], prj["data"].ToString());
                projects.Add(p);
            }

            return true;
        }

        public bool add_project(string name, string data)
        {
            Project p = new Project(projects.Count() + 1, name, DateTime.Now, DateTime.Now, State.UNWIRED, data);
            projects.Add(p);
            return true;
        }

        public bool save_json(string path)
        {
            string file = File.ReadAllText(path);

            // Serializar la lista de proyectos nuevamente a JSON
            //string json_content = JsonConvert.SerializeObject(projects, Formatting.Indented);

            JObject json = new JObject(new JProperty("projects", new JArray()));
            foreach (var prj in projects)
                ((JArray)json["projects"]).Add(prj.to_json(FORMAT_TIME));

            string json_content = JsonConvert.SerializeObject(json, Formatting.Indented);

            // Guardar el contenido actualizado de nuevo en el archivo
            File.WriteAllText(path, json_content);

            return true;
        }

        public DataTable to_datatable()
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("ID");
            dt.Columns.Add("Name");
            dt.Columns.Add("Created");
            dt.Columns.Add("Updated");
            dt.Columns.Add("State");

            foreach (Project p in projects)
            {
                DataRow dr = dt.NewRow();
                dr["ID"] = p.get_id();
                dr["Name"] = p.get_name();
                dr["Created"] = p.get_date_create().ToString();
                dr["Updated"] = p.get_date_update().ToString();
                dr["State"] = p.get_state().ToString();
                dt.Rows.Add(dr);
            }

            return dt;
        }
    }
}
