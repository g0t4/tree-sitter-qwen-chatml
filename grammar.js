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
    // logical grouping (not actual nodes)
    $.repo_name_group,
    $.think_group,
    $.tools_group,
    $.tool_call_group,
    $.tool_response_group,
    $.full_messages_group,
    $.roles_group,
  ],

  rules: {
    source_file: $ => choice(
      choice(
        $.full_messages_group, // only full messages
        $.prefill_message, // only a prefill message (kinda weird though)
        seq(
          $.full_messages_group,
          $.prefill_message // prefill after full message(s)
        )
      ),
      $.fim_file_level,
      $.fim_repo_level,
    ),

    full_messages_group: $ => repeat1(choice($.message, $.tool_response_message)),

    tool_response_message: $ => seq(
      $.im_start_token,
      // $.tool_role,
      $.roles_group, // allow any role, just in case, doesn't hurt
      '\n',

      $.tool_response_group,
      optional($.im_end_token) // FYI this should only be if it is the last message but not gonna bother with that constraint for now
    ),

    user_role: $ => field("role", "user"),
    tool_role: $ => field("role", "tool"),
    assistant_role: $ => field("role", "assistant"),
    system_role: $ => field("role", "system"),
    developer_role: $ => field("role", "developer"),

    roles_group: $ => choice(
      $.user_role,
      $.tool_role,
      $.assistant_role,
      $.system_role,
      $.developer_role,
      field("role", $.until_end_of_line), // greedy, take until end of line
    ),

    message: $ => seq(
      $.im_start_token,
      $.roles_group,
      '\n',

      // thinking (must come before tool_call request)
      optional($.think_group),
      optional($.tools_group),

      // TODO "contents" before tool_call too (see system prompt) => adjust system prompt to add back default
      optional($.tool_call_group),

      optional(prec(-9, field("contents", $.text))), // TODO not contents2
      optional($.im_end_token), // FYI this should only be if it is the last message but not gonna bother with that constraint for now
      optional("\n"),
    ),

    prefill_message: $ => seq(
      $.im_start_token,
      $.roles_group,
    ),

    think_group: $ => seq(
      $.think_open_tag,
      optional(prec(-9, field("reasoning", $.text))),
      $.think_close_tag,
      optional("\n"),
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
      $.tools_close_tag,
      optional("\n"),
    ),
    tools_open_tag: $ => token(constants.TOOLS_OPEN),
    tools_close_tag: $ => token(constants.TOOLS_CLOSE),

    // <tool_call>
    // <function=run_process>
    // <parameter=command_line>
    // date && hostname
    // </parameter>
    // </function>
    // </tool_call>
    tool_call_group: $ => seq(
      $.tool_call_open_tag, "\n",
      "<function=", field("function_name", $.big_word), ">\n",
      repeat($.parameter),
      "</function>\n",
      $.tool_call_close_tag,
      optional("\n"),
    ),
    parameter: $ => seq(
      "<parameter=",
      field("name", $.big_word),
      ">",
      optional("\n"),
      field("value", $.text),
      optional("\n"),
      "</parameter>",
      optional("\n"),
    ),
    tool_call_open_tag: $ => token(constants.TOOL_CALL_OPEN),
    tool_call_close_tag: $ => token(constants.TOOL_CALL_CLOSE),

    tool_response_group: $ => seq(
      $.tool_response_open_tag,
      optional("\n"),
      optional(prec(-9, field("json", $.text))), // TODO can this be non-json?
      optional("\n"),
      $.tool_response_close_tag,
      optional("\n"),
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
    big_word: $ => repeat1(/[A-Za-z0-9_]+/),

  }
});
