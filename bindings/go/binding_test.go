package tree_sitter_qwen_chatml_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_qwen_chatml "github.com/tree-sitter/tree-sitter-qwen_chatml/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_qwen_chatml.Language())
	if language == nil {
		t.Errorf("Error loading Qwen ChatML grammar")
	}
}
