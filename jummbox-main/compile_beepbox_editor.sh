#!/bin/bash
set -e

# Compile editor/main.ts into build/editor/main.js and dependencies
npx tsc

# Combine build/editor/main.js and dependencies into ../beepbox_editor.js
npx rollup build/editor/main.js \
	--file ../beepbox_editor.js \
	--format iife \
	--output.name beepbox \
	--context exports \
	--sourcemap \
	--plugin rollup-plugin-sourcemaps \
	--plugin @rollup/plugin-node-resolve

# Minify ../beepbox_editor.js into ../beepbox_editor.min.js
npx terser \
	../beepbox_editor.js \
	--source-map "content='../beepbox_editor.js.map',url=beepbox_editor.min.js.map" \
	-o ../beepbox_editor.min.js \
	--compress \
	--mangle \
	--mangle-props regex="/^_.+/;"
