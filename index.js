/**
 * Based on https://github.com/glslify/rollup-plugin-glslify
 * and https://github.com/leosingleton/webpack-glsl-minify
 */
'use strict';

import { dirname } from 'path';
import { promises as fsPromises } from 'fs';
import * as _glslify from 'glslify';
import GlslMinify from './lib/minify.js';

async function minifyShader(code, options) {
  // Code adapted from https://github.com/leosingleton/webpack-glsl-minify
  const result = await new GlslMinify(options).executeFile({ contents: code });
  return result.sourceCode;
}

const defaultConfig = {
  extensions: [
    'vs',
    'fs',
    'vert',
    'frag',
    'glsl',
  ],
  glslify: {},
  minify: false,
};

function createFilter(extensions) {
  let expression = `\\.(?:${extensions.map(e => e.split('.').filter(s => Boolean(s)).join('\\.')).join('|')
    })$`;
  return new RegExp(expression);
}

function glslify(userConfig) {
  const config = Object.assign({}, defaultConfig, userConfig);
  const filter = createFilter(config.extensions);

  return {
    name: 'glslify',
    setup(build) {
      // unfortunately glslify is not async
      build.onLoad({ filter }, async (args) => {
        const contents = await fsPromises.readFile(args.path, 'utf8');

        const glslifyConfig = Object.assign({
          basedir: dirname(args.path), // Default value
        }, config.glslify);

        // Compile shader with Glsifiy (follows require() statements)
        let code = _glslify.default.compile(contents, glslifyConfig);

        // Minify shader (based on leosingleton/webpack-glsl-minify)
        if (config.minify) {
          const minifyConfig = typeof config.minify === 'object'
            ? config.minify
            : {};
          code = await minifyShader(code, minifyConfig);
         }

        return { contents: code, loader: 'text', };
       });
    }
  }
}

export { glslify, glslify as default };
