/**
 * Based on https://github.com/glslify/rollup-plugin-glslify
 * and https://github.com/leosingleton/webpack-glsl-minify
 */
'use strict';

import { dirname } from 'path';
import { promises as fsPromises } from 'fs';
import * as _glslify from 'glslify';
import GlslMinify from './lib/minify.js';

let GlslMinifyInstance;

async function compressShader(code, options = {}) {
  // Code adapted from https://github.com/leosingleton/webpack-glsl-minify
  GlslMinifyInstance = GlslMinifyInstance || new GlslMinify(options);
  const result = await GlslMinifyInstance.executeFile({ contents: code });
  return result.sourceCode;
}

const kDefaultConfig = {
  extensions: [
    'vs',
    'fs',
    'vert',
    'frag',
    'glsl',
  ],
  compress: false,
};

function createFilter(extensions) {
  let expression = `\\.(?:${extensions.map(e => e.split('.').filter(s => Boolean(s)).join('\\.')).join('|')
    })$`;
  return new RegExp(expression);
}

function glslify(glslifyOptions, minifyOptions) {
  const config = Object.assign({}, kDefaultConfig, glslifyOptions);
  const filter = createFilter(config.extensions);

  return {
    name: 'glslify',
    setup(build) {
      // unfortunately glslify is not async
      build.onLoad({ filter }, async (args) => {
        const contents = await fsPromises.readFile(args.path, 'utf8');

         const fileOptions = Object.assign({
           basedir: dirname(args.path),
         }, config);

         // Compile code with Glsifiy (follows require() statements)
         let code = _glslify.default.compile(contents, fileOptions);

         // Minify code (based on leosingleton/webpack-glsl-minify)
         if (config.compress) {
           code = await compressShader(code, minifyOptions);
         }

         return {
           contents: code,
           loader: 'text',
         };
       });
    }
  }
}

export { glslify, glslify as default };
