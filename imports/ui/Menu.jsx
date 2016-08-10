import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

import {Menus} from '../api/menus.js';

// Menu component - represents a single menu 
export default class Menu extends Component {
    toggleChecked() {
        // Set the checked property to the opposite of its current value
        Meteor.call('menus.setChecked', this.props.menu._id, !this.props.menu.checked);
    }

    deleteThisMenu() {
        Meteor.call('menus.remove', this.props.menu._id);
    }

    handleAccordion(event){
        event.preventDefault();
    }

    togglePrivate() {
        Meteor.call('menus.setPrivate', this.props.menu._id, ! this.props.menu.private);
    }

    render() {
        
        // Give menus a different className when they are checked off,
        // so that we can style them nicely in CSS
        const menuClassName = classnames({
            checked: this.props.menu.checked,
            private: this.props.menu.private,
        });
        
        return (
            <li className={menuClassName}>
                <button className="delete" onClick={this.deleteThisMenu.bind(this)}>
                    &times;
                </button>

                <input
                    type="checkbox"
                    readOnly
                    checked={this.props.menu.checked}
                    onClick={this.toggleChecked.bind(this)}
                />

                { this.props.showPrivateButton ? (
                    <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
                        { this.props.menu.private ? 'Private' : 'Public' }
                    </button>
                ) : ''}
                <br></br><br></br>
                <div class="panel">
                <button class="button-container" ref="accordionInput" onclick={this.handleAccordion.bind(this)} onmouseover="">{this.props.menu.name}</button>
                </div>
                <br></br>
                Menu Created by: <strong>{this.props.menu.username}</strong>
                <div class="panel">
                    <h3><em>{this.props.menu.ingredients}</em></h3>
                    {this.props.menu.prep_guide}


                </div>

                <span className="name"> </span>
                <span className="ingredients">  </span>
                <span className="prep_guide"></span>
            </li>



        );
    }
}

Menu.propTypes = {
    // This component gets the menu to display through a React prop.
    // We can use propTypes to indicate it is required
    menu: PropTypes.object.isRequired,
    showPrivateButton: React.PropTypes.bool.isRequired,
};

