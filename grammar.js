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
  ],

  rules: {
    source_file: $ => repeat($.message),
    // TODO when doing FIM you'll wanna switch to a sequence of choices for the top-level of source_file
    // source_file: $ => seq(
    //   repeat($.message),
    //   fim_message => (fim_prefix, fim_suffix, fim_middle),
    // ),

    message: $ => seq($.im_start, $.role, '\n', $.message_content, $.im_end),

    role: $ => field("role", $.role_name), // greedy, take until end of line
    role_name: $ => repeat1(/[^\n]+/),

    // message_content: $ => repeat($.any), // TODO constrain this at all?
    message_content: $ => prec(-9, field("contents", $.text)),

    text: $ => repeat1(choice(
      /[^<]+/, // be greedy with any other char (not <)
      /</ // force decision on single < which means it is allowed too just only one char at a time
    )),

    im_start: $ => token(constants.IM_START),
    im_end: $ => token(constants.IM_END),
    // final_token: $ => choice($.im_end, $.return_token, $.call_token) // TODO more than one stop/end token I care about for my parser?

    think_open: $ => token(constants.THINK_OPEN),
    think_close: $ => token(constants.THINK_CLOSE),
  }
});
