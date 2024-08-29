document.getElementById('search-button').addEventListener('click', performSearch);

document.getElementById('search-query').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // منع تنفيذ الإجراءات الافتراضية عند الضغط على Enter
        performSearch();
    }
});

function performSearch() {
    const query = document.getElementById('search-query').value;
    if (query.trim() === "") {
        alert("Please enter a search query.");
        return;
    }

    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: query })
    })
    .then(response => response.json())
    .then(data => {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = ''; // Clear previous results

        if (data.length === 0) {
            resultsDiv.innerHTML = '<p class="text-center text-red-500">No results found.</p>';
        } else {
            data.forEach(result => {
                const resultDiv = document.createElement('div');
                resultDiv.classList.add('result-card');

                resultDiv.innerHTML = `
                    <a href="${result.link}" class="result-title" target="_blank">${result.title}</a>
                    <p class="result-description">${result.description}</p>
                    <a href="${result.link}" class="result-link" target="_blank">${result.link}</a>
                `;
                resultsDiv.appendChild(resultDiv);
            });
        }
    })
    .catch(error => console.error('Error:', error));
}
