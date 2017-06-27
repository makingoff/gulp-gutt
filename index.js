var through = require('through2')
var gutt = require('gutt')
var gutil = require('gulp-util')

var PluginError = gutil.PluginError

module.exports = function (params) {
	if (typeof params === 'function') params = {
		stringifier: params
	}

	return through.obj(function (file, enc, next) {
		var template

		try {
			template = gutt.parseFile(file.path).stringifyWith(params.stringifier)
		} catch (e) {
			return next(new PluginError('gulp-gutt', e.message))
		}

		if (typeof params.handler === 'function') {
			template = params.handler(template, file.path)
		}

		file.contents = new Buffer(template)
		this.push(file)
		next()
	})
}
