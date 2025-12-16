import argparse
import json
import sys
import requests
from bs4 import BeautifulSoup
import time


def scrape(url):
    # 1. Fake a real browser (Anti-bot evasion)
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    try:
        # 2. Perform Request
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        # 3. Parse HTML
        soup = BeautifulSoup(response.text, "html.parser")

        # 4. Extract Data (Example: Title & Meta Description)
        title = soup.title.string if soup.title else "No Title"

        # Get Meta Description
        meta_desc = soup.find("meta", attrs={"name": "description"})
        description = meta_desc["content"] if meta_desc else "No Description"

        # 5. Return Data Structure
        return {
            "success": True,
            "url": url,
            "data": {
                "title": title.strip(),
                "description": description.strip(),
                "h1_count": len(soup.find_all("h1")),
                "links_found": len(soup.find_all("a")),
            },
        }

    except Exception as e:
        # In case of error, we still return JSON, but with success: False
        return {"success": False, "error": str(e)}


if __name__ == "__main__":
    # 1. Parse Arguments
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", required=True, help="The URL to scrape")
    args = parser.parse_args()

    # 2. Run Scraper
    result = scrape(args.url)

    # 3. Print JSON to STDOUT (This is what PHP captures)
    print(json.dumps(result))
