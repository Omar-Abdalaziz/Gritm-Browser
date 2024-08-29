from flask import Flask, render_template, request, jsonify
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    query = request.json.get('query')
    url = f"https://duckduckgo.com/html/?q={query}"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        search_results = []

        

        # استخدام التحديد المناسب لعناصر النتائج في DuckDuckGo
        results = soup.find_all('div', class_='result__body')

        for result in results:
            title_element = result.find('a', class_='result__a')
            description_element = result.find('a', class_='result__snippet')

            title = title_element.text if title_element else 'No title'
            link = title_element['href'] if title_element else 'No link'
            description = description_element.text if description_element else 'No description'

            search_results.append({
                'title': title,
                'link': link,
                'description': description
            })

        return jsonify(search_results)

    return jsonify([])

if __name__ == '__main__':
    app.run(debug=True)
