import csv
import requests

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
