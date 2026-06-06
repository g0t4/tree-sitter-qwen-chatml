#!/usr/bin/env fish

# extract prompt from trace example (so we can create raw_completion from it) ... b/c the trace examples use chat completions and I want a raw completion instead...
# - I can get raw prompt from the original chat completions trace (b/c last_sse has raw prompt)... so I just need a new raw_completion for it!
# - b/c chat completions has messages for content/completion

cat *-trace.json | jq .last_sse.__verbose.prompt --raw-output --join-output >raw_prompt

http POST ask.lan:8012/v1/completions \
    stream=false \
    raw=true \
    prompt=@raw_prompt \
    # only --body 
    --body >response.json

# --join-output to avoid adding \n that's not actually present
cat response.json | jq .choices[0].text --join-output --raw-output >raw_completion

# use printf to avoid cat adding trailing \n
cat raw_prompt raw_completion >raw_full
