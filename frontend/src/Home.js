import { Component } from "react";
import { useParams } from "react-router-dom";
import { Project, ProjectLink } from "./Project";
import { api_request, current_user, logout } from "./utils";

class HomeBase extends Component {
    constructor(props) {
        super(props);
        this.state = { user: undefined, projects: [] };
    }

    componentDidMount() {
        current_user()
            .then(username => this.setState({ "user": username }))
            .then(() => this.updateProjects())
            .then(() => this.selectProject(this.props.params.project_id));
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

    selectProject = (unique_id) => {
        this.project_component && this.project_component.select(unique_id)
            .then(() => window.history.replaceState(null, null, "/project/" + unique_id));
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
                <div className="horizontalBox">
                    <div className="sideBar">{this.state.projects.map(project => <ProjectLink
                        key={project.unique_id}
                        id={project.unique_id} name={project.name}
                        select={this.selectProject} delete={this.deleteProject} />)}
                        <button onClick={this.newProject}>New Project</button>
                    </div>
                    <Project ref={(ip) => this.project_component = ip} updateProjects={this.updateProjects} />
                </div>

            </div >
        );
    };
}


export default function Home(props) {
    const params = useParams();

    return (
        <HomeBase {...props} params={params} />
    );
};
