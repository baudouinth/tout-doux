import { Component } from "react";
import { api_request, current_user, logout } from "./utils";
import Projects from "./Project";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { user: undefined, projects: [] };
    }

    componentDidMount() {
        current_user()
            .then(username => this.setState({ "user": username }))
            .then(() => this.updateProjects());
    }

    updateProjects = () => {
        api_request("project/list")
            .then(response => response.json())
            .then(body => this.setState({ "projects": body.projects }));
    };

    newProject = () => {
        api_request("project/new", { method: "POST" })
            .then(() => this.updateProjects());
    };

    deleteProject = (unique_id) => {
        api_request("project/delete", {
            method: "DELETE",
            body: { unique_id: unique_id }
        })
            .then(() => this.updateProjects());
    };

    render() {
        if (this.state.user === undefined) return (
            <div>
                <h2>A next level TODO list manager</h2>
                <a href="/login">Login</a> <a href="/register">Register</a>
            </div >);

        return (
            <div>
                <h2>Welcome {this.state.user}</h2>
                <a href="/" onClick={logout}>Logout</a>
                <Projects list={this.state.projects} onDelete={this.deleteProject} />
                <button onClick={this.newProject}>New Task List</button>
            </div >
        );
    };
}
