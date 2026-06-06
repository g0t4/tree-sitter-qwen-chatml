#!/usr/bin/env fish

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
