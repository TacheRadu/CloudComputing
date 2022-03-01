from threading import Thread

import requests
import sys


def doRequest():
    requests.get('http://127.0.0.1:3212/random/weather')
    # requests.get('https://google.com')

if __name__ == '__main__':
    count = int(sys.argv[1])
    threads = []
    for i in range(10):
        for j in range(count // 10):
            t = Thread(target=doRequest)
            threads.append(t)
            t.start()
        for t in threads:
            t.join()
        print(f'Wave {i+1} done.', flush=True)
