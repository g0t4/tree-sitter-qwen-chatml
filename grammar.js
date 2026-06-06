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
    $.role,
    $.message_content,
    $.prefix,
    $.suffix,
    $.middle,
    $.repo_name_value,
    $.file_contents,
    $.file_name,
    $.think_contents,
  ],

  rules: {
    source_file: $ => choice(
      repeat($.message),
      $.fim_file,
      $.fim_repo,
    ),

    fim_file: $ => seq(
      // FIM does not require values to be provided for both prefix and suffix
      // - but, it wouldn't make much sense if neither are provided
      $.fim_prefix_token, optional($.prefix),
      $.fim_suffix_token, optional($.suffix),
      $.fim_middle_token, optional($.middle),
    ),

    message: $ => seq($.im_start_token,
      $.role,
      '\n',
      optional($.thoughts),
      $.message_content,
      $.im_end_token
    ),

    role: $ => field("role", $.role_name), // greedy, take until end of line
    role_name: $ => repeat1(/[^\n]+/),

    think_open_token: $ => token(constants.THINK_OPEN),
    think_close_token: $ => token(constants.THINK_CLOSE),
    think_contents: $ => prec(-9, field("contents", $.text)),
    thoughts: $ => seq(
      $.think_open_token,
      optional($.think_contents),
      $.think_close_token
    ),

    // message_content: $ => repeat($.any), // TODO constrain this at all?
    message_content: $ => prec(-9, field("contents", $.text)),

    text: $ => repeat1(choice(
      /[^<]+/, // be greedy with any other char (not <)
      /</ // force decision on single < which means it is allowed too just only one char at a time
    )),


    repo_name_token: $ => token(constants.REPO_NAME),
    repo_name_value: $ => field("name", $.until_end_of_line),
    repo_name: $ => seq($.repo_name_token, $.repo_name_value, "\n"),

    file_contents: $ => prec(-9, field("contents", $.text)),
    until_end_of_line: $ => repeat1(/[^\n]+/), // until end of line
    file_name: $ => prec(-9, field("path", $.until_end_of_line)),
    repo_file: $ => seq(
      $.file_sep_token,
      $.file_name,
      optional("\n"),
      optional($.file_contents)),

    file_sep_token: $ => token(constants.FILE_SEP),
    fim_repo: $ => seq(
      optional($.repo_name),
      repeat1($.repo_file),
      $.fim_file,
    ),



    fim_prefix_token: $ => token(constants.FIM_PREFIX),
    prefix: $ => prec(-9, field("prefix", $.text)),
    fim_suffix_token: $ => token(constants.FIM_SUFFIX),
    suffix: $ => prec(-9, field("suffix", $.text)),
    fim_middle_token: $ => token(constants.FIM_MIDDLE),
    middle: $ => prec(-9, field("middle", $.text)),

    im_start_token: $ => token(constants.IM_START),
    im_end_token: $ => token(constants.IM_END),
    // final_token: $ => choice($.im_end, $.return_token, $.call_token) // TODO more than one stop/end token I care about for my parser?

  }
});
