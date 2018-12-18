// Initialize variables
const work   = document.getElementById('work');
const detail = document.getElementById('detail');
let data;

// Load the data
var request = new XMLHttpRequest();
request.open("GET", "work.json", true);
request.responseType = 'json';
request.onload = function (e) {
  if (request.readyState === 4) {
    if (request.status === 200) {
      data = request.response
      renderGrid(data);
      console.log(request);
    } else {
      console.error(request.statusText);
    }
  }
};
request.onerror = function (e) {
  console.error(request.statusText);
};
request.send(null);

// Render the grid
function renderGrid(items) {
  for (var i = 0; i < items.length; i++) {
    const el  = document.createElement('div');
    const url = items[i].name.replace(/\s+/g, '-').toLowerCase();
    el.className += 'tile';
    el.innerHTML = `<a href="#` + url + `" class="inner" onClick="showDetails(` + i + `)"><img src="` + items[i].coverImg + `" alt="` + items[i].name + `" class="thumb" /></a>`;
    work.appendChild(el);
  }
}

// Show work details
function showDetails(i) {
  const item = data[i];

  let imgs = '';
  for (var i = 0; i < item.imgs.length; i++) {
    const src     = item.imgs[i].url;
    const caption = item.imgs[i].caption;
    imgs += `<figure><img src="` + src + `" alt="` + caption + `" class="fluid" />`;
    if (caption) {
      imgs += `<figcaption class="pad"><span class="text-primary sans">&#x25B4;</span> ` + caption + `</figcaption>`;
    }
    imgs += '</figure>';
  }

  let tags = item.tags.length > 1 ? `Roles: ` : `Role: `;
  for (var i = 0; i < item.tags.length; i++) {
    tags += `<em>` + item.tags[i] + `</em>`;
    tags += i !== item.tags.length-1 ? ` / ` : ``;
  }

  let html =  '<div class="bg-light inner">'+
                '<div class="pad">'+
                  '<h2 class="sans text-big text-alt lh-1">' + item.name + '</h2>'+
                  '<p class="roles text-small">' + tags + '</p>'+
                  '<p>' + item.description + '</p>'+
                '</div>'+
                imgs +
              '</div>';

  detail.innerHTML = html;

  document.body.className += ' show-detail';
  detail.scrollTop = 0;
}

// Close details
function closeDetails() {
  document.body.className -= ' show-detail';
  history.pushState(null, null, '#');
}

// Navigation stuff
window.onhashchange = locationHashChanged;

function locationHashChanged() {
  if(window.location.hash == '') {
    closeDetails();
  }
}

window.addEventListener('keydown', function (event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  switch (event.key) {
    case "Esc": // IE/Edge specific value
    case "Escape":
      // Do something for "esc" key press.
      closeDetails();
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true);
