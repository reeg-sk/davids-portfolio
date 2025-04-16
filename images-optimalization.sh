#!/bin/bash

input_dir="public/images"
output_dir="public/optimalized"

mkdir -p "$output_dir"

for file in "$input_dir"/*.{jpg,jpeg,png}; do
    [ -e "$file" ] || continue
    filename=$(basename -- "$file")
    name="${filename%.*}"
    ffmpeg -i "$file" -vf "scale=iw/4:ih/4" -q:v 75 "$output_dir/${name}.webp"
done

# ffmpeg -i input.mp4 -vcodec libx265 -crf 28 output.mp4
# Video optimalization