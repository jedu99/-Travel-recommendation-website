function searchCondition(event) {
    event.preventDefault();

    const input = document.getElementById('conditionInput')
        .value.trim().toLowerCase();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    fetch('travel_recommendation_api.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Unable to fetch travel data.');
            }
            return response.json();
        })
        .then(data => {
            let destinations = [];

            if (input === 'country' || input === 'countries') {
                destinations = data.countries.flatMap(country => country.cities);
            } else if (input === 'temple' || input === 'temples') {
                destinations = data.temples;
            } else if (input === 'beach' || input === 'beaches') {
                destinations = data.beaches;
            } else {
                const country = data.countries.find(
                    item => item.name.toLowerCase() === input
                );

                destinations = country
                    ? country.cities
                    : [...data.temples, ...data.beaches].filter(
                        item => item.name.toLowerCase() === input
                    );
            }

            if (!destinations.length) {
                resultDiv.textContent = 'No recommendations found.';
                return;
            }

            destinations.forEach(destination => {
                const card = document.createElement('article');
                const heading = document.createElement('h2');
                const image = document.createElement('img');
                const description = document.createElement('p');

                heading.textContent = destination.name;
                image.src = destination.imageUrl;
                image.alt = destination.name;
                description.textContent = destination.description;

                card.append(heading, image, description);
                resultDiv.append(card);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            resultDiv.textContent = 'An error occurred while fetching data.';
        });
}

document.querySelector('.search-form')
    .addEventListener('submit', searchCondition);