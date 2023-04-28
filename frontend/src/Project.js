import { Component } from "react";
import Accordion from "./Accordion";
import PropTypes from 'prop-types';

export default class Projects extends Component {
    static propTypes = {
        list: PropTypes.instanceOf(Object).isRequired,
        onDelete: PropTypes.func.isRequired
    };

    render() {
        return (<Accordion>
            {this.props.list.map(project => (
                <div unique_id={project.unique_id} key={project.unique_id}>
                    <div>{project.name || (<i>Untitled</i>)}
                        <button onClick={
                            (event) => {
                                event.stopPropagation();
                                this.props.onDelete(project.unique_id);
                            }
                        }>DELETE</button>
                    </div>
                    <div>Tasks go here</div>
                </div>
            ))}
        </Accordion >);
    };
}
