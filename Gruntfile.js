/*global module:false*/
var _ = require( 'lodash' );
module.exports = function( grunt ){
  require( 'time-grunt' )( grunt );

  // test GIT branch: if release, publish folder name = "release", else "publish"
  var buildDir = 'publish/',
      branch,
      jadeVars = {
        locale: {}
      },
      head;

  if( grunt.file.exists( '.git/HEAD' ) ){
    head = grunt.file.read( '.git/HEAD' ).replace(/\n/, '').split( '/' );
    branch = head[ head.length - 1 ].toLowerCase();
  }

  if( branch === "release" ){
    buildDir = 'release/';
  }

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

  // default grunt configuration
  var defaults = {
    build: buildDir,
    verbose: true,
    paths: {
      dyn: 'media/dyn',
      img: 'media/img'
    }
  };

  require('jit-grunt')( grunt );

  require('load-grunt-config')(grunt, {
    config: defaults
  });

  grunt.registerTask( 'default', [ 'concurrent' ] );

};


