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

  inline: $ => [
    $.role,
    $.message_content,
    $.prefix,
    $.suffix,
    $.middle,
  ],

  rules: {
    source_file: $ => choice(
      repeat($.message),
      $.fim_file,
    ),

    fim_file: $ => seq(
      // FIM does not require values to be provided for both prefix and suffix
      // - but, it wouldn't make much sense if neither are provided
      $.fim_prefix, optional($.prefix),
      $.fim_suffix, optional($.suffix),
      $.fim_middle, optional($.middle),
    ),

    message: $ => seq($.im_start, $.role, '\n', $.message_content, $.im_end),

    role: $ => field("role", $.role_name), // greedy, take until end of line
    role_name: $ => repeat1(/[^\n]+/),

    // message_content: $ => repeat($.any), // TODO constrain this at all?
    message_content: $ => prec(-9, field("contents", $.text)),

    text: $ => repeat1(choice(
      /[^<]+/, // be greedy with any other char (not <)
      /</ // force decision on single < which means it is allowed too just only one char at a time
    )),
    fim_prefix: $ => token(constants.FIM_PREFIX),
    prefix: $ => prec(-9, field("prefix", $.text)),
    fim_suffix: $ => token(constants.FIM_SUFFIX),
    suffix: $ => prec(-9, field("suffix", $.text)),
    fim_middle: $ => token(constants.FIM_MIDDLE),
    middle: $ => prec(-9, field("middle", $.text)),

    im_start: $ => token(constants.IM_START),
    im_end: $ => token(constants.IM_END),
    // final_token: $ => choice($.im_end, $.return_token, $.call_token) // TODO more than one stop/end token I care about for my parser?

    think_open: $ => token(constants.THINK_OPEN),
    think_close: $ => token(constants.THINK_CLOSE),
  }
});
