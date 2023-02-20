# Select class plan for USOS

### How to get data?
1. Go to [USOS](https://web.usos.pwr.edu.pl/kontroler.php)
2. Select `Katalog` from top nav
3. Select `Przedmioty` from left nav
4. In section `Wyszukiwanie przedmiotów wg jednostki` search `w4n`
5. Select degree course from list (`PO-W04N-SZT- - -ST-IIM-WRO, 1SEM`)
6. Go to `Zobacz plany zajęć tej grupy`
7. Select term (`2022/23-L - Semestr letni 2022/23`)
8. Inspect the table element
9. Right-click on `<table>` tag and copy element.
10. Save copied element in .html file and use it as an input

### How to run?
```
python -m pip install -r requirements.txt
python main.py <saved-file>.html
```
This will generate file named `generated_<saved-file>.html` which you can open in the browser.
