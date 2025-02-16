const animeGrid = document.querySelector('.anime-grid');
const searchBar = document.getElementById('searchBar');
const searchButton = document.getElementById('searchButton');

// Hide anime-grid by default
animeGrid.style.display = 'none';

// Fetch anime data from the Jikan API
async function fetchAnime(query) {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`);
    const data = await response.json();
    displayAnime(data.data);
  } catch (error) {
    console.error('Error fetching anime:', error);
    animeGrid.style.display = 'block'; // Show container to display the error message
    animeGrid.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
  }
}

// Display anime data on the page
function displayAnime(animeList) {
  animeGrid.innerHTML = ''; // Clear previous results

  // Check if animeList is empty
  if (animeList.length === 0) {
    animeGrid.style.display = 'block'; // Show container for no results message
    const noResultsMessage = document.createElement('p');
    noResultsMessage.textContent = 'Sorry, try something else.';
    animeGrid.appendChild(noResultsMessage);
    return;
  }

  animeGrid.style.display = 'grid'; // Make anime-grid visible
  animeList.forEach(anime => {
    const animeCard = document.createElement('div');
    animeCard.classList.add('anime-card');
    animeCard.innerHTML = `
      <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
      <h3>${anime.title}</h3>
      <p>${anime.synopsis ? anime.synopsis.slice(0, 100) + '...' : 'No description available.'}</p>
      <button class="more-details-btn">Show Details</button>
      <div class="anime-details">
        <p><strong>Rating:</strong> ${anime.score ? anime.score : 'N/A'}</p>
        <p><strong>Genres:</strong> ${anime.genres.map(genre => genre.name).join(', ')}</p>
        <p><strong>Episodes:</strong> ${anime.episodes ? anime.episodes : 'N/A'}</p>
        <p><strong>Status:</strong> ${anime.status ? anime.status : 'N/A'}</p>
      </div>
    `;
    animeGrid.appendChild(animeCard);
  });

  // Add event listeners to "Show Details" buttons
  addDetailToggleListeners();
}

// Toggle visibility of anime details
function addDetailToggleListeners() {
  const buttons = animeGrid.querySelectorAll('.more-details-btn');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const animeCard = button.closest('.anime-card');
      const details = animeCard.querySelector('.anime-details');
      details.classList.toggle('show');
      button.textContent = details.classList.contains('show') ? 'Hide Details' : 'Show Details';
    });
  });
}

// Handle search button click
searchButton.addEventListener('click', () => {
  const query = searchBar.value.trim();

  if (query) {
    fetchAnime(query);
  } else {
    animeGrid.style.display = 'block'; // Show container for the empty search message
    animeGrid.innerHTML = '<p>Please enter a search term.</p>';
  }
});
