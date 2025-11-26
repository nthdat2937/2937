import os
import requests
import csv
import time
import re

API_KEY = "AIzaSyDumGMz6ezmnzqljpfmCPS-KQw8UJypww8"
SPREADSHEET_ID = "1vyeom_jNLjTY6_K0xA-oBH5Vc5ISGF-fe9_JM2iVYDw"

OUTPUT_DIR = "output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Lấy danh sách sheet
url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}?key={API_KEY}"
sheet_info = requests.get(url).json()
sheets = sheet_info["sheets"]

# Bỏ 3 sheet đầu
sheets = sheets[3:]

total = len(sheets)
pad = len(str(total))

for index, s in enumerate(sheets, start=1):
    title = s["properties"]["title"]
    num = str(index).zfill(pad)

    print(f"Đang tải sheet: {num} - {title}")

    # Lấy dữ liệu sheet
    data_url = (
        f"https://sheets.googleapis.com/v4/spreadsheets/"
        f"{SPREADSHEET_ID}/values/{title}?key={API_KEY}"
    )
    data = requests.get(data_url).json()
    rows = data.get("values", [])

    output_lines = []

    # Bỏ hàng đầu tiên của sheet
    for row in rows[1:]:
        for i in range(3):  # chỉ 3 cột đầu
            value = row[i] if i < len(row) else ""
            output_lines.append(value)

    text = "\n".join(output_lines)

    # Xử lý tên file an toàn
    safe_title = (
        title.replace("\n", " ")
             .replace("\r", " ")
             .replace("/", "_")
             .replace("\\", "_")
             .strip()
    )

    file_path = os.path.join(OUTPUT_DIR, f"{num}_{safe_title}.txt")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(text)

print("Hoàn tất!")




# Lấy chủ đề
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

# Lấy dữ liệu gốc

# === NHẬP LINK CSV Ở ĐÂY ===
CSV_URL = "https://docs.google.com/spreadsheets/d/1vyeom_jNLjTY6_K0xA-oBH5Vc5ISGF-fe9_JM2iVYDw/gviz/tq?tqx=out:csv&sheet=Trang%20t%C3%ADnh1"

# === TÊN FILE XUẤT RA ===
OUTPUT_FILE = "vocab.txt"

def download_csv(url):
    print("Đang tải dữ liệu từ Google Sheet...")
    response = requests.get(url)
    response.raise_for_status()
    data = response.content.decode("utf-8")
    return list(csv.reader(data.splitlines()))

def export_to_txt(rows, output):
    with open(output, "w", encoding="utf-8") as f:
        for i, row in enumerate(rows):
            if i == 0:  # bỏ qua hàng đầu tiên
                continue
            if len(row) < 2:
                continue
            word = row[0].strip()
            meaning = row[1].strip()
            english = row[2].strip()
            if word and meaning:
                f.write(f"{word}\n{english}\n{meaning}\n")
    print(f"✅ Đã xuất ra file: {output}")

def main():
    try:
        rows = download_csv(CSV_URL)
        export_to_txt(rows, OUTPUT_FILE)
    except Exception as e:
        print("❌ Lỗi:", e)

if __name__ == "__main__":
    main()
time.sleep(3)