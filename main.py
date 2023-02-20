import os
import sys

import parse
import save

if __name__ == '__main__':
    file = sys.argv[1]
    if not os.path.exists(file):
        print(f'File {file} doesn\'t exist')
        exit()
    data = parse.parse(file)
    save.generate_html(data, f'generated_{file}')
