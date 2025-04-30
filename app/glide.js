new Glide('.glide', {
    type: 'carousel',
    perView: 3,
    breakpoints: {
        1100: { perView: 2 },
        600: { perView: 1 }
    }
}).mount();
