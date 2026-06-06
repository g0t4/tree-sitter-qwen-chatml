
export const IM_START = '<|im_start|>'
export const IM_END = '<|im_end|>'

export const FIM_PREFIX = '<|fim_prefix|>'
export const FIM_SUFFIX = '<|fim_suffix|>'
export const FIM_MIDDLE = '<|fim_middle|>'

export const REPO_NAME = '<|repo_name|>'
export const FILE_SEP = '<|file_sep|>'

export const THINK_OPEN = '<think>'
export const THINK_CLOSE = '</think>'

// TODO tool definitions?
// TODO tool call xml format

// export const PAD_TOKEN = '<|endoftext|>'


// TODO / for reference ... tokens per model including when same token differs across Qwen models

// * Qwen/Qwen2.5-Coder-0.5B
//  tokenizer.special_tokens_map
//
// {'eos_token': '<|endoftext|>',
//  'pad_token': '<|endoftext|>'}

// * Qwen/Qwen3.5-0.8B-Base
//  tokenizer.special_tokens_map
//
// {'eos_token': '<|endoftext|>',
// EOS_TOKEN='<|endoftext|>' 
//  'pad_token': '<|endoftext|>',
//  'audio_bos_token': '<|audio_start|>',
//  'audio_eos_token': '<|audio_end|>',
//  'audio_token': '<|audio_pad|>',
//  'image_token': '<|image_pad|>',
//  'video_token': '<|video_pad|>',
//  'vision_bos_token': '<|vision_start|>',
//  'vision_eos_token': '<|vision_end|>'}


// * Qwen/Qwen3.5-0.8B
//  tokenizer.special_tokens_map
//
// {'eos_token': '<|im_end|>',
//  'pad_token': '<|endoftext|>',
//  'audio_bos_token': '<|audio_start|>',
//  'audio_eos_token': '<|audio_end|>',
//  'audio_token': '<|audio_pad|>',
//  'image_token': '<|image_pad|>',
//  'video_token': '<|video_pad|>',
//  'vision_bos_token': '<|vision_start|>',
//  'vision_eos_token': '<|vision_end|>'}

