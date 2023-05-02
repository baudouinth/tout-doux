import PropTypes from "prop-types";
import { Component } from "react";
import ContentEditable from "react-contenteditable";
import { api_request } from "./utils";

export class ProjectLink extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        delete: PropTypes.func.isRequired,
        select: PropTypes.func.isRequired,
    };

    select = (event) => {
        event.preventDefault();
        this.props.select(this.props.id);
    };

    render() {
        const { name, id } = this.props;
        return (<div className="horizontalBox between">
            <a className="text" href={"/project/" + id} onClick={this.select}>
                {name || (<i>Untitled</i>)}
            </a>
            <button onClick={() => this.props.delete(id)}>
                🗑
            </button>
        </div>);
    };
}

export class Project extends Component {
    constructor(props) {
        super(props);
        this.state = { current: {} };
    }

    select = async (id) => {
        return await api_request("project/get", {
            method: "GET",
            params: { unique_id: id }
        })
            .then((response) => response.json())
            .then((body) => this.setState({ current: body }));
    };

    editProject = (name, content) => {
        console.log({ unique_id: this.state.current.unique_id, new_name: name, new_content: content });
        api_request("project/edit", {
            method: "POST",
            body: { unique_id: this.state.current.unique_id, new_name: name, new_content: content }
        });
    };

    editName = (event) => {
        this.editProject(event.target.value.replace("<br>", "\n"));
    };

    editContent = (event) => {
        this.editProject(null, event.target.value.split("<br>"));
    };

    render() {
        const { unique_id: id, name, content } = this.state.current;
        if (id === undefined) {
            return <div className="mainBox">
                <div className="centered"><i>Open a project to see its tasks</i></div>
            </div>;
        }

        return (<div className="mainBox">
            <ContentEditable
                html={name}
                disabled={false}
                onChange={this.editName}
                tagName="h3"
            />
            <ContentEditable
                html={content.join("\n")}
                disabled={false}
                onChange={this.editContent}
            />
        </div>);
    };
}
