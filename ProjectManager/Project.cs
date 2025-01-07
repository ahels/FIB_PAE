using Newtonsoft.Json.Linq;

namespace ProjectManager
{
    enum State
    {
        EMPTY,
        WIRED,
        UNWIRED
    }

    internal class Project
    {
        int id;
        string name;
        DateTime date_create;
        DateTime date_update;
        State state;
        string data;
        

        public Project(int id, string name)
        {
            this.id = id;
            this.name = name;
            this.date_create = DateTime.Now;
            this.date_update = DateTime.Now;
            state = State.EMPTY;
            this.data = "";
        }

        public Project(int id, string name, DateTime date_create, DateTime date_update)
        {
            this.id = id;
            this.name = name;
            this.date_create = date_create;
            this.date_update = date_update;
            state = State.EMPTY;
            this.data = "";
        }

        public Project(int id, string name, DateTime date_create, DateTime date_update, State state, string data)
        {
            this.id = id;
            this.name = name;
            this.date_create = date_create;
            this.date_update = date_update;
            this.state = state;
            this.data = data;
        }

        public JObject to_json(string FORMAT_TIME)
        {
            return new JObject
            {
                ["id"] = this.id,
                ["name"] = this.name,
                ["date_create"] = this.date_create.ToString(FORMAT_TIME),
                ["date_update"] = this.date_update.ToString(FORMAT_TIME),
                ["state"] = (int)this.state,
                ["data"] = this.data
            };
        }

        #region Getters
        public int get_id() { return id; }
        public string get_name() { return name; }
        public DateTime get_date_create() { return date_create; }
        public DateTime get_date_update() { return date_update; }
        public State get_state() { return state; }
        #endregion Getters
    }
}
