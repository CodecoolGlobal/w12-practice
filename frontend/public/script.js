console.log("loaded")

const imagesComponent = (url, title, uploadDate, phName) => `
    <div class="swiper-slide">    
        <div class="card">
            <h2 class="title">${title}</h2>
            <h3>${uploadDate}</h3>
            <h4>${phName}</h4>
            <img src="public/img${url}" />
        </div>
    </div>
`;

const swiperWrapElement = document.querySelector('.swiper-wrapper');

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


fetch(`http://127.0.0.1:9000/images`) // fontos, hogy itt az endpoint url-t adjuk meg
  .then(response => {
    if (response.status === 201) {
      console.log('ok')
    }
    return response.json() // a.json() ayt csin'lja, hogz kicsomagolja nek-nk a nek-nk kellő adatokat, mert a .then-el sokkal több más jön
  })
  .then(responseJson => {
    const data = responseJson
    console.log(data)
    data.forEach(element => {
      // document.querySelector("#root").insertAdjacentHTML("beforeend", 
      // `<h3>${element.title}</h3>
      // <br>
      //   <img src="/public/img${element.url}" />
      // `)
      swiperWrapElement.insertAdjacentHTML('beforeend', imagesComponent(element.url, element.title, element.uploadDate, element.phName));
  })
})


