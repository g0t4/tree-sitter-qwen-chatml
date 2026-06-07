/**
 * @file Parser for raw prompts and completions when working with Qwen models.
 * @author Wes Higbee 
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

import * as constants from "./constants.js";

export default grammar({
  name: "qwen_chatml",

  inline: $ => [
    $.repo_name_group,
    // logical grouping (not actual nodes)
  ],

  rules: {
    source_file: $ => choice(
      repeat($.message),
      $.fim_file_level,
      $.fim_repo_level,
    ),


    message: $ => seq($.im_start_token,
      field("role", $.until_end_of_line), // greedy, take until end of line
      '\n',

      // thinking:
      optional(seq(
        $.think_open_token,
        optional(prec(-9, field("reasoning", $.text))),
        $.think_close_token
      )),

      prec(-9, field("contents", $.text)),
      $.im_end_token
    ),


    think_open_token: $ => token(constants.THINK_OPEN),
    think_close_token: $ => token(constants.THINK_CLOSE),

    fim_file_level: $ => seq(
      $.fim_prefix_token,
      optional(prec(-9, field("prefix", $.text))),
      $.fim_suffix_token,
      optional(prec(-9, field("suffix", $.text))),
      $.fim_middle_token,
      optional(prec(-9, field("middle", $.text))),
    ),

    file_sep_token: $ => token(constants.FILE_SEP),
    fim_repo_level: $ => seq(
      choice(
        $.repo_name_group, // ONLY ONE repo_name
        repeat1($.repo_file), // ONE (or MORE) repo_files
        seq($.repo_name_group, repeat($.repo_file)), // BOTH repo_name AND ONE (or MORE) repo_files 
      ),
      $.fim_file_level,
    ),

    repo_name_token: $ => token(constants.REPO_NAME),
    repo_name_group: $ => seq(
      $.repo_name_token,
      field("repo_name", $.until_end_of_line),
      "\n"
    ),

    repo_file: $ => seq(
      $.file_sep_token,
      prec(-9, field("path", $.until_end_of_line)),
      optional("\n"),
      optional(prec(-9, field("contents", $.text)))),

    fim_prefix_token: $ => token(constants.FIM_PREFIX),
    fim_suffix_token: $ => token(constants.FIM_SUFFIX),
    fim_middle_token: $ => token(constants.FIM_MIDDLE),

    im_start_token: $ => token(constants.IM_START),
    im_end_token: $ => token(constants.IM_END),
    // final_token: $ => choice($.im_end, $.return_token, $.call_token) // TODO more than one stop/end token I care about for my parser?

    until_end_of_line: $ => repeat1(/[^\n]+/), // until end of line
    text: $ => repeat1(choice(
      /[^<]+/, // be greedy with any other char (not <)
      /</ // force decision on single < which means it is allowed too just only one char at a time
    )),

  }
});
