"use strict";

const gulp = require("gulp")
    , sourcemaps = require("gulp-sourcemaps")
    , minifyCSS = require("gulp-csso")
    , sass = require("gulp-sass")
    , merge = require("merge2")
    , del = require("del")
    , runSequence = require("run-sequence")
    , htmlmin = require("gulp-htmlmin")
    , tsify = require("tsify")
    , babelify = require("babelify");

const bundler = require("./tools/bundler");

const paths = {
    sass: {
        src: ["src/sass/**/*.scss", "src/sass/**/*.sass"],
        dest: "dist/css"
    },

    html: {
        src: ["src/*.html"],
        dest: "dist/"
    },

    assets: {
        src: "assets/**/*",
        dest: "dist/"
    }
};

const bundles = [
    {
        entries: "src/main.ts",
        name: "app.bundle.js",
        dest: "dist/js",
        debug: true,
        plugins: [ [tsify, "tsconfig.json"] ],
        transforms: [ ["brfs"] ],
        watch: false,
    }
];

const browserEnvOptions = {
    "targets": {
        "chrome": 52
    }
};

const state = {
    /** true if scripts should be run in production mode. */
    production: false,
};


gulp.task("scripts", function() {
    return bundler(bundles.map(b => {
        let transforms = b.transforms;
        if (!transforms) transforms = [];
        transforms.push([babelify, {
            global: true,
            presets: [
                ["env", browserEnvOptions]
            ],
            extensions: [ ".tsx", ".ts", ".js", ".jsx",".json" ]
        }]);
        b.transforms = transforms;
        return b;
    }));
});

gulp.task("scripts:prod", function() {
    return bundler(bundles.map(b => {
        let transforms = b.transforms;
        if (!transforms) transforms = [];
        transforms.push([babelify, {
            global: true,
            presets: [
                "minify", ["env", browserEnvOptions]
            ],
            extensions: [ ".tsx", ".ts", ".js", ".jsx", ".json" ]}]);
        b.transforms = transforms;
        return b;
    }), {debug: false});
});

gulp.task("scripts:watch", function() {
    return bundler(bundles, { watch: true });
});

gulp.task("sass", function() {
    let s = gulp.src(paths.sass.src)
    if (!state.production) s = s.pipe(sourcemaps.init());
    s = s.pipe(sass().on("error", sass.logError));
    if (state.production) s = s.pipe(minifyCSS({restructure: true, debug: true}));
    if (!state.production) s = s.pipe(sourcemaps.write());
    s = s.pipe(gulp.dest(paths.sass.dest));
});

gulp.task("html", function() {
    let s = gulp.src(paths.html.src);
    if (state.production) s = s.pipe(htmlmin({collapseWhitespace: true}));
    s = s.pipe(gulp.dest(paths.html.dest));
    return s;
});

gulp.task("assets", function() {
    return gulp.src(paths.assets.src)
        .pipe(gulp.dest(paths.assets.dest));
});

gulp.task("build", function(callback) {
    runSequence("clean", ["scripts", "sass", "html", "assets"], callback);
});

gulp.task("build:prod", function(callback) {
    console.log("--PRODUCTION MODE--");
    state.production = true;
    runSequence("clean", ["scripts:prod", "sass", "html", "assets"], callback);
});

gulp.task("watch", ["clean"], function(callback) {
    runSequence("clean", ["scripts:watch", "sass", "html", "assets"], () => {
        gulp.watch(paths.sass.src, ["sass"]);
        gulp.watch(paths.html.src, ["html"]);
        gulp.watch(paths.assets.src, ["assets"]);
        callback();
    })
});

gulp.task("clean", function() {
    return del(["dist/**/*"]);
});