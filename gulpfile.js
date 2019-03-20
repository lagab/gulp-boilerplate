// Defining requirements
var gulp = require( 'gulp' );                         // gulp core.
var plumber = require( 'gulp-plumber' );
var sass = require( 'gulp-sass' );                    // Compile SASS code
var watch = require( 'gulp-watch' );                  // File watcher
var cssnano = require( 'gulp-cssnano' );              // Minify CSS.
var rename = require( 'gulp-rename' );                // Rename files.
var concat = require( 'gulp-concat' );                // Concatenates files
var uglify = require( 'gulp-uglify' );                // Minify JS.
var merge2 = require( 'merge2' );                     // Merge multiple streams
var imagemin = require( 'gulp-imagemin' );            // Images optimisation.
var ignore = require( 'gulp-ignore' );                // Ignore or exclude gulp files
var sourcemaps = require( 'gulp-sourcemaps' );        // Generate SASS sourcemap.
var browserSync = require( 'browser-sync' ).create();
var vinylPaths = require('vinyl-paths');              // Get file paths
var del = require( 'del' );                           // Remove files.
var cleanCSS = require( 'gulp-clean-css' );           // Minify CSS.
var gulpSequence = require( 'gulp-sequence' );        // Run a series of gulp tasks in order
var replace = require( 'gulp-replace' );              // Replace plugin
var autoprefixer = require( 'gulp-autoprefixer' );    // Add browsers prefix.
var jshint = require('gulp-jshint');                  // JS Code quality.
var stylelint = require('gulp-stylelint');            // CSS code quality.


// Configuration file to keep your code DRY
var cfg = require( './gulpconfig.json' );
var paths = cfg.paths;

gulp.task( 'watch-scss', ['browser-sync'], function() {
	gulp.watch( paths.sass + '/**/*.scss', ['scss-for-dev'] );
});

// Run:
// gulp sass
// Compiles SCSS files in CSS
gulp.task( 'sass', function() {
	var stream = gulp.src( paths.sass + '/*.scss' )
		.pipe( plumber( {
			errorHandler: function( err ) {
				console.log( err );
				this.emit( 'end' );
			}
		} ) )
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe( sass( { errLogToConsole: true } ) )
		.pipe( autoprefixer( 'last 2 versions' ) )
		.pipe(sourcemaps.write(undefined, { sourceRoot: null }))
		.pipe( gulp.dest( paths.css ) )
	return stream;
});

/* =============================================================================
   Lint
============================================================================= */
// SCSS
gulp.task('lint-css', ['styles'], function lintCssTask() {

	return gulp
		.src(paths.sass + '**/*.scss')
		.pipe(stylelint({
			syntax: 'scss',
			fix: false,
			reporters: [
				{formatter: 'string', console: true}
			]
		}));
});


// JS.
gulp.task('jshint', function() {
	return gulp.src(paths.dev + '/js/**/*.js')
		.pipe(ignore.exclude('**/bootstrap4/*.js'))
		.pipe(ignore.exclude('**/plugins/contrib/*.js'))
		.pipe(ignore.exclude('**/*.min.js'))
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});


// Run:
// gulp watch
// Starts watcher. Watcher runs gulp sass task on changes
gulp.task( 'watch', function() {
	gulp.watch( paths.sass + '/**/*.scss', ['styles','lint-css'] );
	gulp.watch( [paths.dev + '/js/**/*.js', 'js/**/*.js', '!js/theme.js', '!js/theme.min.js'], ['scripts','jshint'] );

	//Inside the watch task.
	gulp.watch( paths.imgsrc + '/**', ['imagemin-watch'] );
});

/**
 * Ensures the 'imagemin' task is complete before reloading browsers
 * @verbose
 */
gulp.task( 'imagemin-watch', ['imagemin'], function( ) {
	browserSync.reload();
});

// Run:
// gulp imagemin
// Running image optimizing task
gulp.task( 'imagemin', function() {
	gulp.src( paths.imgsrc + '/**' )
		.pipe( imagemin() )
		.pipe( gulp.dest( paths.img ) );
});

// Run:
// gulp cssnano
// Minifies CSS files
gulp.task( 'cssnano', function() {
	return gulp.src( paths.css + '/theme.css' )
		.pipe( sourcemaps.init( { loadMaps: true } ) )
		.pipe( plumber( {
			errorHandler: function( err ) {
				console.log( err );
				this.emit( 'end' );
			}
		} ) )
		.pipe( rename( { suffix: '.min' } ) )
		.pipe( cssnano( { discardComments: { removeAll: true } } ) )
		.pipe( sourcemaps.write( './' ) )
		.pipe( gulp.dest( paths.css ) );
});

gulp.task( 'minifycss', function() {
	return gulp.src( paths.css + '/theme.css' )
		.pipe( sourcemaps.init( { loadMaps: true } ) )
		.pipe( cleanCSS( { compatibility: '*' } ) )
		.pipe( plumber( {
			errorHandler: function( err ) {
				console.log( err ) ;
				this.emit( 'end' );
			}
		} ) )
		.pipe( rename( { suffix: '.min' } ) )
		.pipe( sourcemaps.write( './' ) )
		.pipe( gulp.dest( paths.css ) );
});

gulp.task( 'cleancss', function() {
	return gulp.src( paths.css + '/*.min.css', { read: false } ) // Much faster
		.pipe( ignore( 'theme.css' ) )
		.pipe( vinylPaths(del) );
});

gulp.task( 'styles', function( callback ) {
	gulpSequence( 'sass', 'minifycss' )( callback );
} );

// Run:
// gulp browser-sync
// Starts browser-sync task for starting the server.
gulp.task( 'browser-sync', function() {
	browserSync.init( cfg.browserSyncWatchFiles, cfg.browserSyncOptions );
} );

// Run:
// gulp watch-bs
// Starts watcher with browser-sync. Browser-sync reloads page automatically on your browser
gulp.task( 'watch-bs', ['browser-sync', 'watch', 'scripts'], function() {
} );

// Run:
// gulp scripts.
// Uglifies and concat all JS files into one
gulp.task( 'scripts', function() {
	var scripts = [

		// Start - All BS4 stuff
		paths.dev + '/js/bootstrap4/bootstrap.bundle.js',

		// End - All BS4 stuff

		paths.dev + '/js/skip-link-focus-fix.js',


		// Adding currently empty javascript file to add on for your own themes´ customizations

		// Please add any customizations to this .js file only!
		paths.dev + '/js/custom-javascript.js'
	];
	gulp.src( scripts )
		.pipe( concat( 'theme.min.js' ) )
		.pipe( uglify() )
		.pipe( gulp.dest( paths.js ) );

	gulp.src( scripts )
		.pipe( concat( 'theme.js' ) )
		.pipe( gulp.dest( paths.js ) );
});

// Deleting any file inside the /src folder
gulp.task( 'clean-source', function() {
	return del( ['src/**/*'] );
});

// Run:
// gulp copy-assets.
// Copy all needed dependency assets files from bower_component assets to themes /js, /scss and /fonts folder. Run this task after bower install or bower update

////////////////// All Bootstrap SASS  Assets /////////////////////////
gulp.task( 'copy-assets', function() {

////////////////// All Bootstrap 4 Assets /////////////////////////
// Copy all JS files
	var stream = gulp.src( paths.node + 'bootstrap/dist/js/**/*.js' )
		.pipe( gulp.dest( paths.dev + '/js/bootstrap4' ) );

// Copy all Bootstrap SCSS files
	gulp.src( paths.node + 'bootstrap/scss/**/*.scss' )
		.pipe( gulp.dest( paths.dev + '/sass/vendors/bootstrap4' ) );

////////////////// End Bootstrap 4 Assets /////////////////////////

// Copy all Font Awesome Fonts
	gulp.src( paths.node + 'font-awesome/fonts/**/*.{ttf,woff,woff2,eot,svg}' )
		.pipe( gulp.dest( './fonts' ) );

// Copy all Font Awesome SCSS files
	gulp.src( paths.node + 'font-awesome/scss/*.scss' )
		.pipe( gulp.dest( paths.dev + '/sass/vendors/fontawesome' ) );


});

// Deleting the files distributed by the copy-assets task
gulp.task( 'clean-vendor-assets', function() {
	return del( [paths.dev + '/js/bootstrap4/**', paths.dev + '/sass/vendors/**', './fonts/*wesome*.{ttf,woff,woff2,eot,svg}', paths.dev + '/js/skip-link-focus-fix.js', paths.js + '/**/skip-link-focus-fix.js', paths.js + '/**/popper.min.js', paths.js + '/**/popper.js', ( paths.vendor !== ''?( paths.js + paths.vendor + '/**' ):'' )] );
});

// Run
// gulp dist
// Copies the files to the /dist folder for distribution as simple theme
gulp.task( 'dist', ['clean-dist'], function() {
	return gulp.src( ['**/*', '!' + paths.bower, '!' + paths.bower + '/**', '!' + paths.node, '!' + paths.node + '/**', '!' + paths.dev, '!' + paths.dev + '/**', '!' + paths.dist, '!' + paths.dist + '/**', '!' + paths.distprod, '!' + paths.distprod + '/**', '!' + paths.sass, '!' + paths.sass + '/**', '!readme.txt', '!readme.md', '!package.json', '!package-lock.json', '!gulpfile.js', '!gulpconfig.json', '!CHANGELOG.md', '!.travis.yml', '!jshintignore',  '!codesniffer.ruleset.xml',  '*'], { 'buffer': false } )
		.pipe( replace( '/js/jquery.slim.min.js', '/js' + paths.vendor + '/jquery.slim.min.js', { 'skipBinary': true } ) )
		.pipe( replace( '/js/popper.min.js', '/js' + paths.vendor + '/popper.min.js', { 'skipBinary': true } ) )
		.pipe( replace( '/js/skip-link-focus-fix.js', '/js' + paths.vendor + '/skip-link-focus-fix.js', { 'skipBinary': true } ) )
		.pipe( gulp.dest( paths.dist ) );
});

// Deleting any file inside the /dist folder
gulp.task( 'clean-dist', function() {
	return del( [paths.dist + '/**'] );
});

// Run
// gulp dist-product
// Copies the files to the /dist-prod folder for distribution as theme with all assets
gulp.task( 'dist-product', ['clean-dist-product'], function() {
	return gulp.src( ['**/*', '!' + paths.bower, '!' + paths.bower + '/**', '!' + paths.node, '!' + paths.node + '/**', '!' + paths.dist, '!' + paths.dist +'/**', '!' + paths.distprod, '!' + paths.distprod + '/**', '*'] )
		.pipe( gulp.dest( paths.distprod ) );
} );

// Deleting any file inside the /dist-product folder
gulp.task( 'clean-dist-product', function() {
	return del( [paths.distprod + '/**'] );
} );

// Run:
// gulp
// Starts watcher (default task)
gulp.task('default', ['watch']);
