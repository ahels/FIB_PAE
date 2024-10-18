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
            // Columna acciones
            html.Append("      <th>Actions</th>");
            html.Append("   </tr>");
            html.Append("</thead>");
            #endregion HEADER

            #region BODY
            html.Append("<tbody>");
            foreach (DataRow dr in data.Rows)
            {
                html.Append("<tr>");
                //foreach (var v in dr.ItemArray)
                //    html.Append("<td>" + v + "</td>");
                for (int i = 0; i < dr.ItemArray.Length; ++i)
                {
                    html.Append("<td>");

                    if (i != dr.ItemArray.Length - 1)
                        html.Append(dr[i]);
                    else
                    {
                        string color = "bg-primary";
                        switch (dr[i])
                        {
                            case "WIRED":
                                color = "bg-success";
                                break;
                            case "UNWIRED":
                                color = "bg-danger";
                                break;
                        }
                        html.Append("<span class='badge " + color + "'>");
                        html.Append(dr[i]);
                        html.Append("</span>");
                    }
                    html.Append("</td>");
                }

                // Columna de acciones
                html.Append("   <td>");
                html.Append("      <a><span><i class='fa-solid fa-gear'></i></span></a>");
                html.Append("      <a><span><i class='fa-solid fa-trash-can'></i></span></a>");
                html.Append("   </td>");

                html.Append("</tr>");
            }
            html.Append("</tbody>");
            #endregion BODY

            html.Append("</table>");

            return html.ToString();
        }
    }
}
