import bs4
import re
from typing import List


def parse_colspans(soup: bs4.BeautifulSoup):
    spans = []
    for item in soup.select('th'):
        spans.append(int(item['colspan']))
    return spans


def parse_col_to_day(item: bs4.element.Tag, colspans: List[int]):
    prev_span = sum(map(lambda ps: int(ps['colspan']), item.find_previous_siblings('td')))
    curr_span_sum = 0
    for i, span in enumerate(colspans):
        curr_span_sum += span
        if curr_span_sum > prev_span:
            return ['Mon', 'Tue', 'Wed', 'Thr' ,'Fri'][i]

def parse_link(item: bs4.element.Tag):
    link = item['onclick']
    if m := re.match(r'document.location="(.+)";', link):
        return m.group(1)


def parse_text_1(item: bs4.element.Tag):
    try:
        text = item.select('span')[0].text
        hour_regex = r'[0-9]{1,2}:[0-9]{2}'
        times_regex = rf'{hour_regex}-{hour_regex}'
        kind_regex = r'[WLCSP]{1}'
        group_regex = r'gr.([0-9]+)'
        code_regex = r'[a-z0-9-]+'
        regex = rf'({times_regex}), ({kind_regex}) {group_regex}, ({code_regex})'
        m = re.match(regex, text, re.IGNORECASE)
        return [m.group(1), m.group(2), m.group(3), m.group(4)]
    except: return [None] * 4


def parse_text_2(item: bs4.element.Tag):
    try:
        text = item.select('div')[0].text
        text = re.sub('\n +', ' ', text)
        regex_numbers = r'0123456789'
        regex_polish = r'AaĄąBbCcĆćDdEeĘęFfGgHhIiJjKkLlŁłMmNnŃńOoÓóPpRrSsŚśTtUuWwYyZzŹźŻż'
        occurance_regex = r'/[a-z -]+/ +'
        name_regex = rf'[{regex_polish}{regex_numbers} -]+'
        place_regex = rf'\((.+)\)'
        prof_regex = rf'[{regex_polish} ]+'
        regex = rf'({occurance_regex}|)({name_regex}) {place_regex} - ({prof_regex}|)'
        m = re.match(regex, text, re.IGNORECASE)
        return [m.group(1), m.group(2), m.group(3), m.group(4)]
    except: return [None] * 4


def parse(file: str):
    with open(file, 'r', encoding="utf-8") as f:
        soup = bs4.BeautifulSoup(f, 'html.parser')
    results = []
    colspans = parse_colspans(soup)
    for item in soup.select('td[onclick]'):
        day = parse_col_to_day(item, colspans)
        link = parse_link(item)
        time, kind, group, code = parse_text_1(item)
        occurance, name, place, prof = parse_text_2(item)
        results.append({
            'link': link,
            'time': time,
            'day': day,
            'kind': kind,
            'group': group,
            'code': code,
            'occurance': occurance,
            'name': name,
            'place': place,
            'prof': prof,
        })
    return results
