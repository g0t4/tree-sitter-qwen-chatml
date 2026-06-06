/**
 * @file Parser for raw prompts and completions when working with Qwen models.
 * @author Wes Higbee 
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

import * as constants from "./constants.js";
// constants.IM_START

export default grammar({
  name: "qwen_chatml",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
