import React from 'react';
import PropTypes from 'prop-types';


class AccordionSection extends React.Component {
    static propTypes = {
        children: PropTypes.instanceOf(Object).isRequired,
        isOpen: PropTypes.bool.isRequired,
        key_: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
    };

    onClick = () => this.props.onClick(this.props.key_);

    render() {
        const isOpen = this.props.isOpen;

        return (
            <div
                style={{
                    background: isOpen ? '#fae042' : '#6db65b',
                    border: '1px solid #008f68',
                    padding: '5px 10px',
                }}
            >
                <div onClick={this.onClick} style={{ cursor: 'pointer' }}>
                    {this.props.children[0]}
                    <div style={{ float: 'right' }}>
                        {!isOpen && <span>&#9650;</span>}
                        {isOpen && <span>&#9660;</span>}
                    </div>
                </div>
                {isOpen && this.props.children[1]}
            </div>
        );
    }
}

export default class Accordion extends React.Component {
    static propTypes = {
        children: PropTypes.instanceOf(Object).isRequired,
    };

    constructor(props) {
        super(props);

        const openSections = {};
        this.state = { openSections };
    }

    onClick = (key_) => {
        const {
            state: { openSections },
        } = this;

        const isOpen = !!openSections[key_];

        this.setState({
            openSections: {
                [key_]: !isOpen
            }
        });
    };

    render() {
        const {
            onClick,
            props: { children },
            state: { openSections },
        } = this;

        return (
            <div style={{ border: '2px solid #008f68' }}>
                {Object.entries(children).map(([index, child]) => {
                    return (<AccordionSection
                        isOpen={!!openSections[child.props.unique_id]}
                        key={child.props.unique_id}
                        key_={child.props.unique_id}
                        onClick={onClick}
                    >
                        {child.props.children}
                    </AccordionSection>
                    );
                })}
            </div>
        );
    }
}
