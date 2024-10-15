using System.Data;
using System.Text;

namespace htmlParser
{
    public class Table
    {
        int id;
        string name;
        DataTable data;

        public Table(int id, string name, DataTable data)
        {
            this.id = id;
            this.name = name;
            this.data = data;
        }

        public string to_html()
        {
            StringBuilder html = new StringBuilder();



            return html.ToString();
        }
    }
}
