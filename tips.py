#!/usr/bin/env python
# coding: utf-8

def load_nouns(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        return [line.strip() for line in file]

def filter_nouns(nouns, no, exact, not_there):
    must_be = set()

    for i in range(5):
        must_be.update(set(exact[i]))
        must_be.update(set(not_there[i]))

    possible = []
    for noun in nouns:
        if not set(no).isdisjoint(noun):
            continue

        continue_other = False
        for i in range(5):
            if exact[i] != '' and noun[i] != exact[i]:
                continue_other = True

        if continue_other:
            continue

        continue_other = False
        for i in range(5):
            for l in not_there[i]:
                if l != '' and noun[i] == l:
                    continue_other = True

        if continue_other:
            continue

        if not all(char in noun for char in must_be):
            continue

        possible.append(noun)

    return possible

if __name__ == "__main__":
    filename = 'sorted_nouns.txt'
    no = 'слово'
    exact = ['', '', '', '', '']
    not_there = ['', '', '', '', '']

    nouns = load_nouns(filename)
    possible = filter_nouns(nouns, no, exact, not_there)

    print(len(possible))
    print(possible)
