const animeGrid = document.querySelector('.anime-grid');
const searchBar = document.getElementById('searchBar');
const searchButton = document.getElementById('searchButton');

async function fetchAnime(query) {
  const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`);
  const data = await response.json();
  displayAnime(data.data);
}

function displayAnime(animeList) {
  animeGrid.innerHTML = ''; // Clear previous results
  
  // Check if animeList is empty
  if (animeList.length === 0) {
    const noResultsMessage = document.createElement('p');
    noResultsMessage.textContent = 'Sorry, try something else.';
    animeGrid.appendChild(noResultsMessage);
    return; // Exit the function early if no results are found
  }
  
  // Loop through the anime list and display the results
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
    
    // Add event listener to toggle details
    animeCard.querySelector('.more-details-btn').addEventListener('click', () => {
      const details = animeCard.querySelector('.anime-details');
      details.classList.toggle('show');
      const btnText = details.classList.contains('show') ? 'Hide Details' : 'Show Details';
      animeCard.querySelector('.more-details-btn').textContent = btnText;
    });
    
    animeGrid.appendChild(animeCard);
  });
}

searchButton.addEventListener('click', () => {
  const query = searchBar.value;
  fetchAnime(query);

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.more-details-btn');
  
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const animeCard = button.closest('.anime-card');  // Get the closest parent card
        const details = animeCard.querySelector('.anime-details');  // Get the details section
        
        // Toggle the visibility of the details section
        details.classList.toggle('show');

        if (details.classList.contains('show')) {
            button.textContent = 'Hide Details';
          } else {
            button.textContent = 'Show Details';
          }

      });
    });
  });
  



});
