'use strict';

var Backbone = require('backbone');
var Exam = require('../models/ExamModel');
var _ = require('underscore');

module.exports = Backbone.Collection.extend({
  model: Exam,

  initialize: function () {
    this.clashCount = 0;
    this.totalModuleCredits = 0;
    this.listenTo(this, {add: this.onAdd, remove: this.onRemove});
  },

  addModule: function (module) {
    var moduleCredit = this.calculateModuleCredit(module);

    this.add({
      color: module.get('color'),
      ExamDate: module.get('ExamDate'),
      examStr: module.get('examStr'),
      id: module.id,
      ModuleTitle: module.get('ModuleTitle'),
      Semester: module.get('Semester'),
      ModuleCredit: moduleCredit
    });
  },

  onAdd: function (exam) {
    this.totalModuleCredits += parseInt(exam.get("ModuleCredit"));
    // Compute clashes based on keys with clustered hours.
    var clashes = this.where({key: exam.get('key')});
    if (clashes.length > 1) {
      // If clash found, set clash property on all of them.
      _.each(clashes, function(clash) {
        clash.set('clash', true);
      });
      this.clashCount++;
    }
  },

  onRemove: function(exam) {
    this.totalModuleCredits -= parseInt(exam.get("ModuleCredit"));

    if (exam.get('clash')) {
      var clashes = this.where({key: exam.get('key')});
      if (clashes.length === 1) {
        clashes[0].set('clash', false);
      }
      this.clashCount--;
    }
  },

  // Sort by custom key: if have exam, month then date then clustered hour,
  // if not, sort alphabetically by code. As the numerical keys come before
  // the alphabetical ones, modules with no exam will appear at the bottom,
  // as intended.
  comparator: function(exam) {
    return exam.get('key');
  },

  calculateModuleCredit: function(exam) {
    var moduleCredit = exam.get('ModuleCredit');
    moduleCredit = exam.get('ModuleTitle').match(/dissertation/i) ? moduleCredit / 2 : moduleCredit
    return moduleCredit;
  }
});
