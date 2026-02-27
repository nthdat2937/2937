#thu vien
import random
import os
import time

#dem
dung = 0
sai = 0

#mo tu dien
with open('tu_dien.txt',"r",encoding="utf-8") as f:
    xem = [line.strip() for line in f.readlines()]

#kiem tra
print(xem)

#tao ham
tieng_viet = []
tieng_anh = []
tieng_han = []

#tach danh sach
for i in range(0,len(xem)):
    if i%3 == 0:
        tieng_han.append(xem[i])
    elif i%3 == 1:
        tieng_anh.append(xem[i])
    elif i%3 == 2:
        tieng_viet.append(xem[i])

# app
while True:
    try:
        os.system('clear')
        print(f'Dung {dung} Sai {sai}')
        nn = random.randint(0,len(tieng_han)-1)
        rep = input(f'Nghia cua tu "{tieng_han[nn]}" la:\n - Vietnamese: ')
        if dung+sai == 100:
            os.system('clear')
            print(f'Hoan thanh chuong trinh luyen tieng Han!\nDiem so {dung}/{dung+sai}')
            
            break
        if rep == f'{tieng_viet[nn]}':
            print("Chinh xac!")
            dung = dung + 1
            time.sleep(0.5)
        else:
            print("Sai!")
            print(f'Dap an chinh xac: {tieng_viet[nn]}')
            sai = sai + 1
            time.sleep(1)
    except KeyboardInterrupt:
        print('\nDong chuong trinh!')
        break