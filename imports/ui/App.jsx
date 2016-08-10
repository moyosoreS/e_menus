import React, { Component, PropTypes } from 'react';
import Pagination from "react-js-pagination";
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';

import {Menus} from '../api/menus.js';

import Menu from './Menu.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// App component - represents the whole app
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hideCompleted: false,
        };
    }

    handleSubmit(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const name = ReactDOM.findDOMNode(this.refs.nameInput).value.trim();
        const ingredients = ReactDOM.findDOMNode(this.refs.ingredientsInput).value.trim();
        const prep_guide = ReactDOM.findDOMNode(this.refs.prepInput).value.trim();

        Meteor.call('menus.insert', name, ingredients, prep_guide);

        // Clear form
        ReactDOM.findDOMNode(this.refs.nameInput).value = '';
        ReactDOM.findDOMNode(this.refs.ingredientsInput).value = '';
        ReactDOM.findDOMNode(this.refs.prepInput).value = '';
    }

    toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted,
        });
    }

    renderMenus() {
        let filteredMenus = this.props.menus;
        if (this.state.hideCompleted) {
            filteredMenus = filteredMenus.filter(menu => !menu.checked);
        }
        return filteredMenus.map((menu) => {
            const currentUserId = this.props.currentUser && this.props.currentUser._id;
            const showPrivateButton = menu.owner === currentUserId;

            return (
                <Menu
                    key={menu._id}
                    menu={menu}
                    showPrivateButton={showPrivateButton}
                />
            );
        });
    }

    render() {
        return (
            <div className="container">
                <header>
                    <h1>Menu List ({this.props.incompleteCount})</h1>

                    <label className="hide-completed">
                        <input
                            type="checkbox"
                            readOnly
                            checked={this.state.hideCompleted}
                            onClick={this.toggleHideCompleted.bind(this)}
                        />
                        Hide Completed Menus
                    </label>

                    <AccountsUIWrapper />
                    { this.props.currentUser ?
                    <form className="new-menu" onSubmit={this.handleSubmit.bind(this)} >
                        <input
                            type="text"
                            ref="nameInput"
                            placeholder="Type to add menu name"
                        />
                        <input
                            type="text"
                            ref="ingredientsInput"
                            placeholder="Type to add menu ingredients"
                        />
                        <input
                            type="text"
                            ref="prepInput"
                            placeholder="Type to add menu preparation guide"
                        />
                        <button onclick="{this.handleSubmit.bind(this)}"> Add menu</button>
                    </form>: ''
                    }
                </header>

                <ul>
                    {this.renderMenus()}
                </ul>

            </div>
        );
    }
}
App.propTypes = {
    menus: PropTypes.array.isRequired,
    incompleteCount: PropTypes.number.isRequired,
    currentUser: PropTypes.object,
};

export default createContainer(() => {
    Meteor.subscribe('menus');
    return {
        menus: Menus.find({}, { sort: { createdAt: -1 } }).fetch(),
        incompleteCount: Menus.find({ checked: { $ne: true } }).count(),
        currentUser: Meteor.user(),
    };
}, App);