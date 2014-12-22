/*global module:false*/
module.exports = {
  media: {
    options: {
      // For PNGs
      optimizationLevel: 7
    },
    files: [{
       // Enable dynamic expansion
      expand: true,
      // Src matches are relative to this path
      cwd: 'media',
      // Actual patterns to match
      src: ['**/*.{gif,jpg,jpeg,png,svg}', '!_*/*.{gif,jpg,jpeg,png,svg}'],
      // Destination path prefix
      dest: '<%= build %>media/'
    }]
  }
};
