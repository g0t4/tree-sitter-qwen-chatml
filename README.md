## tree-sitter-qwen_chatml

A tree-sitter parser for Qwen's raw prompt/completion format.

## tree-sitter CLI
```fish
# FYI nix is a good way to install tree-sitter

# completion
tree-sitter complete --shell fish > ~/.config/fish/completions/tree-sitter.fish

# ensure parser is detected
tree-sitter dump-languages
# will show query types too like highlights

# developing grammar
tree-sitter generate
tree-sitter build

# test parsing:
tree-sitter parse test.harmony
tree-sitter generate && tree-sitter parse examples/individual/system_message.harmony
tree-sitter generate && tree-sitter parse examples/individual/developer_message.harmony
# review output, it shows line/col of failures! i.e. ERROR nodes

# interactive web 'app'
# run docker to target wasm:
tree-sitter build --wasm # FYI --docker might work too
tree-sitter playground  # as you type it updates the tree!
# check "query" box ... and it will match/color the nodes in your queries!
# can use queries below
```

query examples, made up classes (@start/@end)
```highlights.scm
(start_token) @start
(end_token) @end
```

```fish
# test queries!
tree-sitter query queries/highlights.scm test.harmony
```

