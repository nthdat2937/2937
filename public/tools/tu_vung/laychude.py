import os
import re

def write_filenames_to_topic_file():
    # Define the folder and output file paths
    folder_path = '/home/td2937/Desktop/2937/public/tools/tu_vung/output'
    output_file = '/home/td2937/Desktop/2937/public/tools/tu_vung/topic.txt'

    # Check if the folder exists
    if not os.path.exists(folder_path):
        print(f"Error: The folder '{folder_path}' does not exist.")
        return

    # Get all filenames in the folder
    filenames = os.listdir(folder_path)

    # Extract number and name from filenames
    items = []
    for filename in filenames:
        match = re.match(r'^(\d+)[\s._-]*(.+)$', filename)
        if match:
            num = int(match.group(1))
            items.append((num, filename))

    # Sort by number
    items.sort(key=lambda x: x[0])

    # Write sorted filenames to the output file
    with open(output_file, 'w', encoding='utf-8') as f:
        for num, name in items:
            # Remove .txt extension before writing
            name_without_ext = name.replace('.txt', '')
            f.write(name_without_ext + '\n')

    print(f"✓ Lấy tên chủ đề thành công!")
    print(f"✓ Tổng số chủ đề: {len(items)}")
    print(f"✓ Đã ghi vào: {output_file}")

if __name__ == "__main__":
    write_filenames_to_topic_file()
