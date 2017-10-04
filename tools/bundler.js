const gulp = require("gulp")
    , babel = require("gulp-babel")
    , browserify = require("browserify")
    , watchify = require("watchify")
    , tsify = require("tsify")
    , source = require('vinyl-source-stream')
    , buffer = require('vinyl-buffer')
    , gutil = require('gulp-util')
    , merge = require("merge2");

class Bundle {
    constructor({entries, name, dest, debug = true, plugins = undefined, transforms = undefined, watch = false}) { 
        this.name = name;
        this.dest = dest;
        let opts = { entries, debug };
        if (watch) opts = Object.assign({}, watchify.args, opts);
        this.bundler = browserify(opts);

        if (plugins !== undefined && plugins != null) {
            if (Array.isArray(plugins)) {
                for (let i = 0; i < plugins.length; i++) {
                    const plugin = plugins[i];
                    if (Array.isArray(plugin)) {
                        this.bundler = this.bundler.plugin.apply(this.bundler, plugin);
                    } else {
                        this.bundler = this.bundler.plugin.apply(this.bundler, [plugin]);
                    }
                }
            } else {
                throw Error("Plugins must be an array of arguments (which can also be arrays if there are multiple).");
            }
        }

        if (transforms !== undefined && transforms !== null) {
            if (Array.isArray(transforms)) {
                for (let i = 0; i < transforms.length; i++) {
                    const transform = transforms[i];
                    if (Array.isArray(transform)) {
                        this.bundler = this.bundler.transform.apply(this.bundler, transform);
                    } else {
                        this.bundler = this.bundler.transform.apply(this.bundler, [transform]);
                    }
                }
            } else {
                throw Error("Transforms must be an array of arguments (which can also be arrays if there are multiple).");
            }
        }

        if (watch) {
            this.bundler = watchify(this.bundler);
            this.bundler.on("update", this.bundle.bind(this));
            this.bundler.on("log", gutil.log);
        }
    }

    bundle() {
        return this.bundler.bundle()
            .on('error', gutil.log.bind(gutil, `Browserify Error [${this.name}]`))
            .pipe(source(this.name))
            .pipe(buffer())
            .pipe(gulp.dest(this.dest));
    }
}

module.exports = function(bundles, override) {
    if (!Array.isArray(bundles)) bundles = [bundles];
    if (override) { bundles = bundles.map(b => Object.assign({}, b, override)); }
    return merge(bundles.map(b => new Bundle(b).bundle()));
}