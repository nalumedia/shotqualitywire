import requests
import xml.etree.ElementTree as ET
from datetime import datetime

# Your Contentful Space ID and Access Token
SPACE_ID = 'z3p5u8zjlu6y'
ACCESS_TOKEN = 'BSnHYPTE-ndLC2oSrhu6cSdMeK9Ay45QQ0tCj9bz9a0'

# Contentful API URL to fetch blog posts
CONTENTFUL_URL = f'https://cdn.contentful.com/spaces/{SPACE_ID}/environments/master/entries?access_token={ACCESS_TOKEN}&content_type=blog'

# Fetch posts from Contentful
response = requests.get(CONTENTFUL_URL)
data = response.json()
posts = [{'url': item['fields']['postUrl'], 'lastmod': item['sys']['updatedAt']} for item in data['items']]

# Find the most recent 'lastmod' from posts
most_recent_lastmod = max(post['lastmod'] for post in posts)

# Static Routes in your app with 'lastmod' as most recent post mod date
static_routes = [{'url': '/', 'lastmod': most_recent_lastmod}, 
                 {'url': '/about', 'lastmod': most_recent_lastmod},
                 {'url': '/calendar', 'lastmod': most_recent_lastmod},
                 {'url': '/contact', 'lastmod': most_recent_lastmod},
                 {'url': '/wnba', 'lastmod': most_recent_lastmod},
                   {'url': '/odds', 'lastmod': most_recent_lastmod},
                 {'url': '/BasketballAnalytics', 'lastmod': most_recent_lastmod}]
               

# All routes (static + dynamic)
all_routes = static_routes + posts

# Create XML
urlset = ET.Element('urlset', xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")

for route in all_routes:
    url = ET.SubElement(urlset, 'url')
    loc = ET.SubElement(url, 'loc')
    loc.text = f"https://shotqualitywire.com{route['url']}"
    
    # Include lastmod if available
    if route['lastmod']:
        lastmod = ET.SubElement(url, 'lastmod')
        lastmod.text = datetime.strptime(route['lastmod'], '%Y-%m-%dT%H:%M:%S.%fZ').strftime('%Y-%m-%d')

# Write XML to file
tree = ET.ElementTree(urlset)
tree.write("public/sitemap.xml", encoding='utf-8', xml_declaration=True)

# Print the total number of pages in the sitemap
print(f"Total number of pages in the sitemap: {len(all_routes)}")
