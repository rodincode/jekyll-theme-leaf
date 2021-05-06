---
layout: post
author: Rohan Sahni
title: Interactive Mapping
---


<html>
<head>


<script src='https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.js'></script>
<link href='https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.css' rel='stylesheet' />

</head>
<body>
  <h2>COVID-19 Interactive Data Visualization</h2>
  <ul>
    <li>
  <h4>Flourish Studio</h4>
      <ul>
        <li>
          <h5>BarChart Race</h5>
          <div class="flourish-embed flourish-bar-chart-race" data-src="visualisation/6065144"><script src="https://public.flourish.studio/resources/embed.js"></script></div>
        </li>
       <li>
         <h5>Projection Map</h5>
<div class="flourish-embed flourish-map" data-src="visualisation/6064923"><script src="https://public.flourish.studio/resources/embed.js"></script></div>
        </li>
      </ul>
    </li>
    <li>
      <h4>MapBox</h4>
<div id='map' style='width: 675px; height: 500px;'></div>
<script>
  mapboxgl.accessToken = 'pk.eyJ1Ijoicm9kaW5jb2RlIiwiYSI6ImNrbXVncWhpOTExN2kyb3E1MWc2MnNvNmcifQ.Rf9LemJ5ymKLMcZQyQ6j5g';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11'
  });
</script>
    </li>
  </ul>
</body>
</html>
