import argparse
import requests
from bs4 import BeautifulSoup
import os
import http.server
import socketserver

def download(url, name):
    r = requests.get(url, allow_redirects=True)
    open(name, "wb").write(r.content)


def generate(arg):
    base = "https://andrealicheri.github.io/boosted-html/"
    addBase = lambda path: base + path
    download(addBase("boostedhtml.min.js"), "boostedhtml.min.js")
    if arg.pwa == "pwa":
        print("Generating boosted-html PWA...")
        download(addBase("templates/index-pwa.html"), "index.html")
        download(addBase("templates/app.webmanifest"), "app.webmanifest")
        download(addBase("templates/sw.js"), "sw.js")
        print("Done!")
    else:
        print("Generating boosted-html project...")
        download(addBase("templates/index.html"), "index.html")
        print("Done!")


def populate():
    tag_to_add = '<script defer src="/boostedhtml.min.js"></script>'

    for filename in os.listdir():
        if filename.endswith(".html"):
            with open(filename, "r") as file:
                soup = BeautifulSoup(file, "html.parser")
                head_tag = soup.find("head")
                existing_tags = set([str(tag) for tag in head_tag.find_all()])
                if tag_to_add not in existing_tags:
                    new_tag = BeautifulSoup(tag_to_add, "html.parser")
                    head_tag.append(new_tag)
                    with open(filename, "w") as modified_file:
                        modified_file.write(str(soup))

            print(f"Populated {filename}")

def serve(args):
    PORT = args.port
    Handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at port {PORT}")
        httpd.serve_forever()


def main():
    parser = argparse.ArgumentParser(description="Blaze: boosted-html CLI helper")
    subparsers = parser.add_subparsers(title="Subcommands", dest="subcommand")

    subtract_parser = subparsers.add_parser("init", help="Generates boosted-html project")
    subtract_parser.add_argument("pwa", type=str, help="Generates PWA files", nargs="?", default=None)

    subtract_parser = subparsers.add_parser("populate", help="Populate HTML files with a boosted-html script tag")
    subtract_parser = subparsers.add_parser("serve", help="Serve app on a port. Default is 8000")
    subtract_parser.add_argument("port", type=int, help="Port number", nargs="?", default=8000)

    args = parser.parse_args()
    if args.subcommand == "init":
        generate(args)
    elif args.subcommand == "populate":
        populate()
    elif args.subcommand == "serve":
        serve(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()