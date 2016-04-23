var generators = require('yeoman-generator');
var path = require('path');
var _s = require('underscore.string');

module.exports = generators.Base.extend({
  prompting: {
    ask: function() {
      var done = this.async();
      this.prompt({
        type: 'input',
        name: 'name',
        message: 'Your project name',
        validate: function (input) {
          var pass = input.match(/^[a-zA-Z-_]+$/);
          if (pass) {
            return true;
          }
          return 'Letters, hypens and underscores only.';
        },
      }, function (answers) {
        this.name = _s.slugify(answers.name);
        done();
      }.bind(this));
    }
  },
  writing: {
    source: function () {
      var src = path.dirname(require.resolve('sass-corius'));
      this.fs.copy(
        src,
        this.destinationPath(), {
          globOptions: {
            ignore: [
              src + '/package.json',
              src + '/README.md',
              src + '/node_modules/**/*',
              src + '/doc/**/*',
              src + '/build.scss',
              src + '/sass/_corius.scss'
            ]
          }
        }
      );
    },
    library: function () {
      this.fs.copyTpl(
        this.templatePath('_library.scss'),
        this.destinationPath('sass/_' + this.name + '.scss')
      );
    },
    build: function () {
      this.fs.copyTpl(
        this.templatePath('build.scss'),
        this.destinationPath('build.scss'),
        { name: this.name }
      );
    },
    pkg: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        { name: this.name }
      );
    }
  },
  install: function () {
    this.installDependencies();
  }
});