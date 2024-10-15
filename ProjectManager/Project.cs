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
        

        public Project(int id, string name)
        {
            this.id = id;
            this.name = name;
            this.date_create = DateTime.Now;
            this.date_update = DateTime.Now;
            state = State.EMPTY;
        }

        public Project(int id, string name, DateTime date_create, DateTime date_update)
        {
            this.id = id;
            this.name = name;
            this.date_create = date_create;
            this.date_update = date_update;
            state = State.EMPTY;
        }

        public Project(int id, string name, DateTime date_create, DateTime date_update, State state)
        {
            this.id = id;
            this.name = name;
            this.date_create = date_create;
            this.date_update = date_update;
            this.state = state;
        }
    }
}
