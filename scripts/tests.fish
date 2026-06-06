#!/usr/bin/env fish

scripts/check_version.fish || exit 1

tree-sitter generate
tree-sitter build # fast enough, why not
tree-sitter test

