const link = '/api/v1/proxy-rss'
let inf = ''
let ref = document.getElementById("newsrow")

fetch(link)
  .then(response => response.text())
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
    let html = ``;
    const items = Array.from(data.querySelectorAll("item")).slice(0,5);

    items.forEach(el => {
        let author = el.querySelector("creator").innerHTML;
        
        if (author.length > 37){
            author = author.slice(0,37) + '...'
        }

        html += `
          <div class="col news-article">
            <h6>
              <a href="${el.querySelector("link").innerHTML}" target="_blank" rel="noopener">
                ${el.querySelector("title").innerHTML}
              </a>
            </h6>
            
            <div class="newsxtra">
                <h7>Written by: ${author}</h7>
                <p>${el.querySelector("pubDate").innerHTML.slice(0,-14)}</p>
            </div>
          </div>
        `;
      });
      ref.innerHTML += html
  })
  .catch(error => console.error('Error:', error));