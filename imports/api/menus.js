import {Mongo} from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Menus = new Mongo.Collection('menus');

if (Meteor.isServer) {
    // This code only runs on the server
    // Only publish menus that are public or belong to the current user
    Meteor.publish('menus', function menusPublication() {
        return Menus.find({
            $or: [
                { private: { $ne: true } },
                { owner: this.userId },
            ],
        });
    });
}

Meteor.methods({
    'menus.insert'(name, ingredients, prep_guide) {
        check(name, String);
        check(ingredients, String);
        check(prep_guide, String);

        // Make sure the user is logged in before inserting a menu
        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Menus.insert({
            name,
            ingredients,
            prep_guide,
            createdAt: new Date(),
            owner: this.userId,
            username: Meteor.users.findOne(this.userId).username,
        });
    },
    'menus.remove'(menuId) {
        check(menuId, String);

        const menu = Menus.findOne(menuId);
        if (menu.private && menu.owner !== this.userId) {
            // If the menu is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }

        Menus.remove(menuId);
    },
    'menus.setChecked'(menuId, setChecked) {
        check(menuId, String);
        check(setChecked, Boolean);

        const menu = Menus.findOne(menuId);
        if (menu.private && menu.owner !== this.userId) {
            // If the menu is private, make sure only the owner can check it off
            throw new Meteor.Error('not-authorized');
        }
        Menus.update(menuId, { $set: { checked: setChecked } });
    },
    'menus.setPrivate'(menuId, setToPrivate) {
        check(menuId, String);
        check(setToPrivate, Boolean);

        const menu = Menus.findOne(menuId);

        // Make sure only the menu owner can make a menu private
        if (menu.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Menus.update(menuId, { $set: { private: setToPrivate } });
    },
});