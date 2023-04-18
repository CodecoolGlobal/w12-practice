console.log("loaded")

const imagesComponent = ({id, url, title, uploadDate, phName}) => `
    <div class="swiper-slide">    
        <div class="card" data-id="${id}">
            <h2 class="title">${title}</h2>
            <h3>${uploadDate}</h3>
            <h4>${phName}</h4>
            <button class="delete-pic">Delete</button>
            <img src="public/img${url}" />
        </div>
    </div>
`

const formComponent = () => `
    <form id="add-image">
        <input type="file" name="file" />
        <br>
        <label for="title">Title:</label>
        <input type="text" name="title" id="title" />
        <br>
        <label for="ph-name">Photographer:</label>
        <input type="text" name="ph-name" id="ph-name" />
        <br>
        <button id="send-button">Send</button>
        </form>
        `

// initialize swiper
const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },
});

const rootElement = document.querySelector('#root');
const swiperWrapElement = document.querySelector('.swiper-wrapper');

// FETCH IMAGES
fetch(`http://127.0.0.1:9000/images`) 
  .then(response => {
    if (response.status === 201) {
      console.log('ok')
    }
    return response.json() 
  })
  .then(responseJson => {
    const data = responseJson
    data.forEach(element => {
      // alap megoldás:
      // document.querySelector("#root").insertAdjacentHTML("beforeend", 
      // `<h3>${element.title}</h3>
      // <br>
      //   <img src="/public/img${element.url}" />
      // `)
      swiperWrapElement.insertAdjacentHTML('beforeend', imagesComponent(element));
    })
  })

// ADD NEW IMAGE
rootElement.insertAdjacentHTML('beforeend', formComponent());
const formElement = document.querySelector('#add-image')

formElement.addEventListener('submit', (event) => {
  event.preventDefault();
  
  let inputFile = formElement.querySelector('input[name="file"]').files[0]
  let inputTitle = formElement.querySelector('input[name="title"]').value
  let inputPhName = formElement.querySelector('input[name="ph-name"]').value
  
  if (inputTitle.length === 0 || inputPhName.length === 0) {
    return alert('Please fill all the required fields!');
  };
  const formData = new FormData();
  formData.append('image', inputFile);
  formData.append('title', inputTitle);
  formData.append('phName', inputPhName);
  
  
  fetch('/upload-image', {
    method: "POST",
    body: formData
  })
    .then(response => response.json())
    .then(responsejson => {
      swiperWrapElement.insertAdjacentHTML('beforeend', imagesComponent(responsejson))
      deleting()
    })
});

// DELETE IMAGE
const deleting = () => {
  setTimeout(() => {
    const deleteButtons = document.querySelectorAll('.delete-pic');
    console.log("deleteButtons",deleteButtons.length)
  
    for (let i = 0; i < deleteButtons.length; i++) {
        const button = deleteButtons[i];
        console.log("button", button)
        button.addEventListener("click", function deleteImage(e) {
            const bulletPoint = document.querySelectorAll('.swiper-pagination-bullet')[i];
            let imageDiv = e.target.parentElement;
            console.log("imageDiv",imageDiv)
            let identifier = imageDiv.dataset.id
            console.log("identifier", identifier)

            fetch(`/delete-image/${identifier}`, {
                method: 'DELETE',
            })
                .then(imageDiv.parentElement.remove())
                .then(bulletPoint.remove())
        });
    }
  }, 1000)
}
deleting()


