#!/bin/bash
set -e

# Compile editor/main.ts into build/editor/main.js and dependencies
npx tsc

# Combine build/editor/main.js and dependencies into ../beepbox_editor.js
npx rollup build/editor/main.js \
	--file ../react/my-app/public/beepbox_editor.js \
	--format iife \
	--output.name beepbox \
	--context exports \
	--sourcemap \
	--plugin rollup-plugin-sourcemaps \
	--plugin @rollup/plugin-node-resolve

# Minify ../beepbox_editor.js into ../beepbox_editor.min.js
npx terser \
	../react/my-app/public/beepbox_editor.js \
	--source-map "content='../react/my-app/public/beepbox_editor.js.map',url=beepbox_editor.min.js.map" \
	-o ../react/my-app/public/beepbox_editor.min.js \
	--compress \
	--mangle \
	--mangle-props regex="/^_.+/;"
