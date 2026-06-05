#!/usr/bin/env fish

# --join-output skips trailing new line after JSON objects (so we don't add extra \n that is not there)
cat *-trace.json | jq .last_sse.prompt --join-output --raw-output > raw_prompt
cat *-trace.json | jq .content --join-output --raw-output > raw_completion

# --join-output skips trailing \n after each JSON object
#  otherwise you end up getting an extra \n that will look like it was part of generated completion (and mess up the FIM diff b/c it will push suffix down a line when it wasn't an extra line down to start as if model messed up and added an extra \n at end of completion)
command cat raw_prompt raw_completion > raw_full
