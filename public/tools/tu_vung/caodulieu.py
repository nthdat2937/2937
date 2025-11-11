import csv
import requests

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

# Lấy dữ liệu theo chủ đề

import csv
import requests
import os
from collections import OrderedDict

# === NHẬP LINK CSV Ở ĐÂY ===
CSV_URL = "https://docs.google.com/spreadsheets/d/1vyeom_jNLjTY6_K0xA-oBH5Vc5ISGF-fe9_JM2iVYDw/gviz/tq?tqx=out:csv&sheet=Trang%20t%C3%ADnh1"

# === TÊN THƯ MỤC XUẤT RA ===
OUTPUT_FOLDER = "output"

def download_csv(url):
    print("Đang tải dữ liệu từ Google Sheet...")
    response = requests.get(url)
    response.raise_for_status()
    data = response.content.decode("utf-8")
    return list(csv.reader(data.splitlines()))

def export_to_txt_by_topic(rows, output_folder):
    # Tạo thư mục đầu ra nếu chưa tồn tại
    os.makedirs(output_folder, exist_ok=True)

    # Nhóm dữ liệu theo chủ đề (duy trì thứ tự)
    topics = OrderedDict()  # Sử dụng OrderedDict để duy trì thứ tự chủ đề
    for i, row in enumerate(rows):
        if i == 0:  # Bỏ qua hàng đầu tiên (header)
            continue
        if len(row) < 4:  # Đảm bảo có đủ cột
            continue
        word = row[0].strip()
        meaning = row[1].strip()
        english = row[2].strip()
        topic = row[3].strip()
        if word and meaning and topic:  # Chỉ xử lý nếu đủ dữ liệu
            if topic not in topics:
                topics[topic] = []  # Duy trì thứ tự bằng cách sử dụng danh sách
            topics[topic].append((word, english, meaning))

    # Xuất dữ liệu ra các tệp theo chủ đề
    for index, (topic, entries) in enumerate(topics.items(), start=1):  # Đánh số thứ tự từ 1
        topic_file = os.path.join(output_folder, f"{index:02d}_{topic}.txt")
        with open(topic_file, "w", encoding="utf-8") as f:
            for word, english, meaning in entries:
                f.write(f"{word}\n{english}\n{meaning}\n")
        print(f"✅ Đã xuất ra file: {topic_file}")

def main():
    try:
        rows = download_csv(CSV_URL)
        export_to_txt_by_topic(rows, OUTPUT_FOLDER)
    except Exception as e:
        print("❌ Lỗi:", e)

if __name__ == "__main__":
    main()
