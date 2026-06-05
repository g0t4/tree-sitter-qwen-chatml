## TODO examples collection notes

Setup examples like I have with harmony format (qwen can use these as stop criteria)

examples to accumulate:
- [x] fim completions repo level (doubles as file level FIM if you strip out <|file_sep|> and <|repo_name|> sections
- [x] chat with thinking (<think>...</think>)
- [ ] tool calls
  - are there differing tool call formats across qwen models? (i.e. JSON vs XML?)
  - make sure example capture includes tool definitions (do definition formats change across models?)


## llama-server stores these primary qwen templates in its repo

suggests these represent the spectrum of Qwen prompt formats

[models/templates/Qwen-QwQ-32B.jinja](https://github.com/ggml-org/llama.cpp/blob/master/models/templates/Qwen-QwQ-32B.jinja)
[models/templates/Qwen-Qwen2.5-7B-Instruct.jinja](https://github.com/ggml-org/llama.cpp/blob/master/models/templates/Qwen-QwQ-32B.jinja)
[models/templates/Qwen-Qwen3-0.6B.jinja](https://github.com/ggml-org/llama.cpp/blob/master/models/templates/Qwen-QwQ-32B.jinja)
[models/templates/Qwen3-Coder.jinja](https://github.com/ggml-org/llama.cpp/blob/master/models/templates/Qwen3-Coder.jinja)
[models/templates/Qwen3.5-4B.jinja](https://github.com/ggml-org/llama.cpp/blob/master/models/templates/Qwen3.5-4B.jinja)
