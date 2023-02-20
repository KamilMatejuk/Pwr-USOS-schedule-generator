import re
from typing import Dict


def generate_head():
    return  '<head>\n' +\
            '    <meta charset="UTF-8">\n' +\
            '    <meta http-equiv="X-UA-Compatible" content="IE=edge">\n' +\
            '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +\
            '    <title>Plan</title>\n' +\
            '</head>\n'

def generate_style():
    with open('save.css', 'r', encoding="utf-8") as f:
        return f'<style>{f.read()}</style>'

def generate_js():
    with open('save.js', 'r', encoding="utf-8") as f:
        return f'<script>{f.read()}</script>'

def generate_table():
    # header
    days = ['', 'Poniedzialek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek']
    divs = [f'<div class="header">{day}</div>' for day in days]
    # rows with hours
    for hour in [
        '7:30 - 9:00',
        '9:15 - 11:00',
        '11:15 - 13:00',
        '13:15 - 15:00',
        '15:15 - 16:55',
        '17:05 - 18:45',
        '18:55 - 20:35']:
            for i, col in enumerate(range(6)):
                ids = f'h{hour.split(":")[0]}c{col}'
                if i == 0:
                    hour = hour.replace(' - ', '<br/>-<br/>')
                    divs.append(f'<div id="{ids}" class="cell">{hour}</div>')
                else: divs.append(f'<div id="{ids}" class="cell"></div>')
    return  '<div id="table">\n' + '\n    '.join(divs) + '\n' + '</div>\n'


def generate_js_object(data: Dict[str, str]):
    return '<script>DATA = [\n    ' + ',\n    '.join(map(str, data)) + '\n]\n</script>'


def generate_html(data: Dict[str, str], outfile: str):
    with open(outfile, 'w+', encoding="utf-8") as f:
        f.write(re.sub(r' {12}', '',
            f'''<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Plan</title>
            </head>
            <body>
            {generate_style()}
            <div class="content">
            <button id="save" onclick="save()">Zapisz</button>
            <div id="selected"></div>
            {generate_table()}
            </div>
            {generate_js_object(data)}
            {generate_js()}
            </body>
            </html>'''))
