/* global module:false */
var path = require( 'path' ),
    files,
    datas,
    devDatas;
var _ = require( 'lodash' );

module.exports = function(grunt){

  var getDatas = function(){
    var jadeVars = {
      locale: {}
    };
    var baseData = grunt.file.readYAML( 'locales/site.yaml' );
    _.assign( jadeVars, baseData );

    // read several json for jade datas
    grunt.file.recurse('locales/', function(abspath, rootdir, subdir, filename){
      if( 'site.yaml' !== filename && filename.indexOf('yaml') !== -1 ){
        var data = grunt.file.readYAML(abspath);

        jadeVars.locale[ data.lang ] = data;
      }
    });

    grunt.config.set('jadedatas', jadeVars);
  };

  datas = grunt.config.get('jadedatas');
  devDatas = grunt.util._.extend( { dev: true }, datas );

  files = [{
    expand: true,
    cwd: 'pages/',
    src: [ '**/*.jade', '!_**/*.jade', '!_*.jade', "!tree.jade" ],
    ext: '.html',
    dest: '<%= build %>'
  }];

  grunt.event.on('watch', function(action, filepath) {

    getDatas();

    var filename = path.basename( filepath );
    if( '.jade' === path.extname( filepath ) || '.yaml' === path.extname( filepath ) ){
      var src = files;
      if( 'pages' === path.dirname( filepath ) && '.yaml' !== path.extname( filepath ) && '_layout.jade' !== filename ){
        src = [{
          expand: true,
          cwd: 'pages/',
          src: [ path.basename( filepath ) ],
          ext: '.html',
          dest: '<%= build %>'
        }];
      }
      else if( '.yaml' === path.extname( filepath ) ){
        grunt.config( 'jade.dev.options.data', grunt.util._.extend( { dev: true }, grunt.config.get('jadedatas') ) );
      }
      grunt.config( 'jade.dev.files', src );

    }
  });

  return {
    dev: {
      files: [{
        expand: true,
        cwd: 'pages/',
        src: [ '**/*.jade', '!_**/*.jade', '!_*.jade', "!tree.jade" ],
        ext: '.html',
        dest: '<%= build %>'
      }],
      options: {
        data: devDatas,
        pretty: true,
        selfClose: true,
        compileDebug: false
      }
    },
    release: {
      files: '<%= jade.dev.files %>',
      options: {
        data: datas,
        pretty: true,
        selfClose: true,
        compileDebug: false
      }
    }
  };
};
