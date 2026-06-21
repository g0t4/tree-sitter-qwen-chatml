[
  (message
    (system_role)) @qwen_message_system
  (message
    (developer_role)) @qwen_message_developer
  (message
    (user_role)) @qwen_message_user
  (message
    (assistant_role)) @qwen_message_assistant
  (tool_response_message) @qwen_message_tool_response
  (message
    role: (until_end_of_line)) @qwen_message_all_other_roles
]

[
  (fim_prefix_token) @qwen_fim_prefix_token
  prefix: (text) @qwen_fim_prefix_contents
]

[
  (fim_suffix_token) @qwen_fim_suffix_token
  suffix: (text) @qwen_fim_suffix_contents
]

[
  (fim_middle_token) @qwen_fim_middle_token
  middle: (text) @qwen_fim_middle_contents
]

[
  (repo_name_token) @qwen_repo_name_token
  repo_name: (until_end_of_line) @qwen_repo_name
]

[
  ; (repo_file) @qwen_repo_file
  (file_sep_token) @qwen_file_sep_token
  path: (until_end_of_line) @qwen_file_path
  (repo_file
    contents: (text)) @qwen_file_contents
]

[
  (think_open_tag) @qwen_think_tag
  reasoning: (text) @qwen_think_reasoning
  (think_close_tag) @qwen_think_tag
]
