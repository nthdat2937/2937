so = int(input("Nhap so can lap: "))
tulap = input("Nhap tu can lap: ")
sothutu = input("Co can hien so thu tu khong (Y/n): ")
i = 1

while True:
    if sothutu == "n":
        print(tulap)
    else:
        print(str(i)+"."+tulap)
    
    i = i+1
    if i > so:
        break
