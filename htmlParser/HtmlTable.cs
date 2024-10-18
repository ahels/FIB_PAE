using System.Data;
using System.Text;

namespace HtmlParser
{
    public class HtmlTable
    {
        const string DEFAULT_CSS = "table table-dark";

        string id;
        string name;
        DataTable data;
        string css;

        public HtmlTable(string id, string name, DataTable data)
        {
            this.id = id;
            this.name = name;
            this.data = data;
            this.css = DEFAULT_CSS;
        }

        public string to_html()
        {
            StringBuilder html = new StringBuilder();

            html.Append("<table id='" + id + "' name='" + name + "' class='" + css + "'>");

            #region HEADER
            html.Append("<thead>");
            html.Append("   <tr>");
            foreach (DataColumn dc in data.Columns)
                html.Append("<th>" + dc.ColumnName + "</th>");
            html.Append("   </tr>");
            html.Append("</thead>");
            #endregion HEADER

            #region BODY
            html.Append("<tbody>");
            foreach (DataRow dr in data.Rows)
            {
                html.Append("<tr>");
                foreach (var v in dr.ItemArray)
                    html.Append("<td>" + v + "</td>");
                html.Append("</tr>");
            }
            html.Append("</tbody>");
            #endregion BODY

            html.Append("</table>");

            return html.ToString();
        }
    }
}
