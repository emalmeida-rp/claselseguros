new Glide('.glide', {
    type: 'carousel',
    perView: 3,
    breakpoints: {
        768: { perView: 2 },
        425: { perView: 1 }
    }
}).mount();
