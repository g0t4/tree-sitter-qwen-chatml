#!/usr/bin/env fish

# tree-sitter --version
# tree-sitter 0.26.0
set ts_version (tree-sitter --version | string match --regex " \d+\.\d+" | string trim --left)
echo "version: $ts_version"

set major (string split . $ts_version)[1]
set minor (string split . $ts_version)[2]

# quick way to test major.minor by assuming minor never more than 6 digits long
set as_number (math "$major * 1000000 + $minor")
# 0.26 => 0*10000000 + 26 => 26

if test "$as_number" -lt 26
    echo "Error: tree-sitter version is $ts_version, but 0.26 or newer is required (for :cst style tests)."
    exit 1
end


