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
    $.tools_group,
    $.think_group,
    $.tool_call_group,
    $.tool_response_group,
    // logical grouping (not actual nodes)
  ],

  rules: {
    source_file: $ => choice(
      choice(
        repeat(
          choice($.message, $.response_message) // TODO reuse with repeat->choice below too
        ), // only full messages
        $.prefill_message, // only a prefill message (kinda weird though)
        seq(
          repeat(
            choice($.message, $.response_message)
          ),
          $.prefill_message), // full messages and then prefill on end (this is realisitic scenario for assistant prefill)
      ),
      $.fim_file_level,
      $.fim_repo_level,
    ),

    response_message: $ => seq(
      $.im_start_token,
      field("role", $.until_end_of_line), // greedy, take until end of line
      '\n',

      $.tool_response_group,
      optional($.im_end_token) // FYI this should only be if it is the last message but not gonna bother with that constraint for now
    ),

    message: $ => seq(
      $.im_start_token,
      field("role", $.until_end_of_line), // greedy, take until end of line
      '\n',

      // thinking (must come before tool_call request)
      optional($.think_group),
      optional($.tools_group),

      // TODO "contents" before tool_call (see system prompt) => adjust system prompt to add back default
      optional($.tool_call_group),

      prec(-9, field("contents", $.text)), // TODO not contents2
      optional($.im_end_token) // FYI this should only be if it is the last message but not gonna bother with that constraint for now
    ),

    prefill_message: $ => seq(
      $.im_start_token,
      field("role", $.until_end_of_line),
    ),

    think_group: $ => seq(
      $.think_open_tag,
      optional(prec(-9, field("reasoning", $.text))),
      $.think_close_tag
    ),
    think_open_tag: $ => token(constants.THINK_OPEN),
    think_close_tag: $ => token(constants.THINK_CLOSE),

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

    tools_group: $ => seq(
      $.tools_open_tag,
      optional(prec(-9, field("json_definitions", $.text))), // TODO tool call definitions (JSON) ... redo with JSON injection?
      $.tools_close_tag
    ),
    tools_open_tag: $ => token(constants.TOOLS_OPEN),
    tools_close_tag: $ => token(constants.TOOLS_CLOSE),

    tool_call_group: $ => seq(
      $.tool_call_open_tag,
      optional(prec(-9, field("TODO", $.text))), // TODO 
      $.tool_call_close_tag
    ),
    tool_call_open_tag: $ => token(constants.TOOL_CALL_OPEN),
    tool_call_close_tag: $ => token(constants.TOOL_CALL_CLOSE),

    tool_response_group: $ => seq(
      $.tool_response_open_tag,
      optional(prec(-9, field("TODO", $.text))), // TODO 
      $.tool_response_close_tag
    ),
    tool_response_open_tag: $ => token(constants.TOOL_RESPONSE_OPEN),
    tool_response_close_tag: $ => token(constants.TOOL_RESPONSE_CLOSE),

    im_start_token: $ => token(constants.IM_START),
    im_end_token: $ => token(constants.IM_END),

    until_end_of_line: $ => repeat1(/[^\n]+/), // until end of line
    text: $ => repeat1(choice(
      /[^<]+/, // be greedy with any other char (not <)
      /</ // force decision on single < which means it is allowed too just only one char at a time
    )),

  }
});
