# esbuild-plugin-glslify-minify
Compile GLSL shaders and minify. Based on the following projects:
- [darionco/esbuild-plugin-glslify](https://github.com/darionco/esbuild-plugin-glslify)
- [leosingleton/webpack-glsl-minify](https://github.com/leosingleton/webpack-glsl-minify)

## Usage

```bash
npm install --save-dev @befunky/esbuild-plugin-glslify-minify
```

## Configuration

```js
esbuildPluginGlslifyMinify({
  // What extensions to compile. Defaults:
  extensions: ['vs', 'fs', 'vert', 'frag', 'glsl'],

  // Glslify options
  // See https://github.com/glslify/glslify#var-src--glslcompilesrc-opts
  glslify: {
    basedir: './helpers',
  },

  // Minification options 
  // See https://github.com/leosingleton/webpack-glsl-minify#loader-options
  minify: {
    preserveUniforms: true,
    preserveDefines: true,
  },

  // To avoid minification, omit the config or set it to a falsy value, e.g.
  minify: false,

});
```

## Usage in Gulp task

```js
import gulpEsbuild from 'gulp-esbuild';
import esbuildPluginGlslifyMinify from 'esbuild-plugin-glslify-minify';

gulp.task('js-app', () => {
  return gulp.src('./path/to/index.js')
    .pipe(gulpEsbuild({
      plugins: [
        esbuildPluginGlslifyMinify({
          // See configuration (above)
        }),
      ],
      // other esbuild options
    }))
});
```
