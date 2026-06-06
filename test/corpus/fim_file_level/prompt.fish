# parse the contents only using cst pasrser using test file
cat test/corpus/fim_file_level/prompt.test | head -17 | tail -13 | tree-sitter parse --cst --scope source.qwen_chatml
