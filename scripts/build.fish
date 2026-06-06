#!/usr/bin/env fish

scripts/tests.fish || exit 1

tree-sitter build --wasm
