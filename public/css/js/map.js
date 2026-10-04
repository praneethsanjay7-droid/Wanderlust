
  console.log(mapToken);
  mapboxgl.accessToken=mapToken;
    const listingCoordinates = JSON.parse(coordinates);

    const map = new mapboxgl.Map({
        container: 'map', // container ID
      center: listingCoordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
     });

     console.log(coordinates);

  const marker1 = new mapboxgl.Marker({color: 'red'})
      .setLngLat(listingCoordinates) //listings.geometry.coordinates
      .setPopup(new mapboxgl.Popup({offset: 25, className: 'my-class'})
        .setHTML("<p>Exact location provided after booking</p>"))
        .addTo(map);

        
//   const marker2 = new mapboxgl.Marker({color: 'red'})
//       .setLngLat(listingCoordinates) //listings.geometry.coordinates
//       .setPopup(new mapboxgl.Popup({offset: 25, className: 'my-class'})
//         .setHTML("<p>Exact location provided after booking</p>"))
//         .addTo(map);