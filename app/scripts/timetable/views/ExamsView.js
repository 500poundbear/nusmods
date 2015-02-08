'use strict';

var $ = require('jquery');
var ExamView = require('./ExamView');
var Marionette = require('backbone.marionette');
var template = require('../templates/exams.hbs');
var _ = require('underscore');

var EmptyView = Marionette.ItemView.extend({
  tagName: 'tr',
  template: _.template('<td colspan="4" class="empty-timetable">No modules added.</td>')
});

module.exports = Marionette.CompositeView.extend({
  tagName: 'table',
  className: 'table table-bordered table-condensed',
  childView: ExamView,
  childViewContainer: 'tbody',
  emptyView: EmptyView,
  template: template,
  templateHelpers: function() {
    return { totalModuleCredits: this.collection.totalModuleCredits };
  },
  collectionEvents: {
    'add remove': function() {
      $('#clash').toggleClass('hidden', !this.collection.clashCount);
      $('#total-module-credit').text("Total: " + this.collection.totalModuleCredits);
    }
  }
});
