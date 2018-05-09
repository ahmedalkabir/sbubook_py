from html.parser import HTMLParser


# just i want to strip some tags of html so I made my own class
class HTMLS(HTMLParser):

    def __init__(self):
        super().__init__()
        self.reset()
        self.strict = False
        self.convert_charrefs = True
        self.fed = []

    def handle_data(self, data):
        self.fed.append(data)

    def get(self):
        return ''.join(self.fed)


def strip_tags(html):
    instance = HTMLS()
    instance.feed(html)
    return instance.get()
