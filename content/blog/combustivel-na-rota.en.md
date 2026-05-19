---
title: "How I Ended Up in Foz do Iguaçu with a Quarter Tank and Built a Fuel Price Finder"
slug: combustivel-na-rota
date: 2026-05-19T10:00:00.000Z
lang: en
excerpt: "A story about how poor planning and a nearly empty tank led me to build a tool for finding cheap fuel along any route in Paraná, Brazil."
tags:
  - react
  - cloudflare
  - ux
  - open-source
cover: /blog/combustivel.png
author: Rogério Bayer
---

Trip planning is usually the fun part, until reality knocks on the door. I had my bags packed and was about to leave Curitiba for Foz do Iguaçu when I noticed the gauge: a quarter tank. Over 630 kilometers of highway ahead, and I had no idea where I'd stop to refuel or how much it would cost.

Paraná state has an excellent tool called Menor Preço, powered by real-time data from the Nota Paraná program. The problem is the design premise: the official app works like a radar. It grabs your current location, draws a 20 km radius, and shows what's around.

For someone sitting on the couch planning a trip across the state, this is useless. You don't want to know the price at the corner gas station; you want to know the price in Guarapuava or Cascavel before you even start the engine.

That annoyed me enough to stop planning the trip and start planning a tool. The result is live at [combustivel.bayer.ooo](https://combustivel.bayer.ooo).

## The Problem: Right Data, Wrong Question

The State Revenue Department provides the data, but the official interface restricts searches to a single point. If you want to drive the entire BR 277 highway, you'd have to open the app every 40 km to check if the next station is cheaper. If you're in Curitiba, it won't show stations in Ponta Grossa; if you're in Ponta Grossa, it won't show Guarapuava.

The challenge wasn't lack of information, but **spatial context**. A route isn't a point; it's a line crossing dozens of municipalities. The right question to ask the system wasn't "where is cheap fuel right now?", but rather "where is cheap fuel along this route?"

## The Solution: Sampling the Road

To solve this, I built an intelligence layer on top of the existing data. The logic works in four steps:

**1. Geocoding:** When you enter the origin and destination, the browser asks **Nominatim** (OpenStreetMap's geocoder) where those places are. It returns latitude and longitude.

**2. Routing:** With coordinates in hand, the app calls **OSRM** (Open Source Routing Machine), which plots the road route. The response includes the complete road geometry: a sequence of thousands of points describing every curve of the highway.

**3. Smart Sampling:** Querying the government API for every coordinate on the line would be inefficient and heavy. Instead, I split the route into segments, collecting a reference point every 20 km or so. A Curitiba to Foz trip becomes roughly 30 query points.

**4. Batch Search:** For each sampled point, the system fires a query within a 20 km radius. Requests run in parallel, and results are combined, deduplicated, and sorted.

Local search also exists. If you prefer to check prices near a specific city without plotting a route, just type the municipality name. The system performs the same geohash-based query within a 20 km radius — but with a single request, since there's no route to sample.

## The Tech Stack (and why it ended up faster)

As a developer, I aimed for a lightweight, maintainable architecture. The frontend is built with **React** and **Leaflet** for maps, with queries cached via **TanStack Query**. The API proxy runs on a **Cloudflare Worker**, allowing the site and backend to share the same domain without CORS headaches.

As a bonus, the result is considerably faster and smoother than the public app. The secret lies in TanStack Query's aggressive caching when moving the map and Cloudflare Workers' efficiency in orchestrating parallel calls.

### In practice: how the requests work

All communication happens through the browser. If you open DevTools (F12) on the Network tab, you'll see this exact flow of real requests:

#### Geocoding: address to coordinates

```bash
curl "https://nominatim.openstreetmap.org/search?q=Curitiba&format=json&limit=5&countrycodes=br&addressdetails=1"
```

```json
[
  {
    "lat": "-25.4284",
    "lon": "-49.2733",
    "display_name": "Curitiba, Paraná, Região Sul, Brasil"
  }
]
```

#### Routing: coordinates to route

OSRM receives the points and returns the road line, distance in meters, and duration in seconds:

```bash
curl "https://router.project-osrm.org/route/v1/driving/-49.2733,-25.4284;-54.5648,-25.5483?overview=full&geometries=geojson"
```

```json
{
  "routes": [
    {
      "geometry": {
        "coordinates": [
          [-49.2733, -25.4284],
          [-49.2801, -25.4302]
        ]
      },
      "distance": 632584.7,
      "duration": 26041.2
    }
  ]
}
```

#### Price lookup: geohash to stations

Each sampling point is converted to a **geohash** with precision 12. This ensures the government API query is surgical, preserving accuracy without exposing raw coordinates:

```bash
curl "https://menorpreco.notaparana.pr.gov.br/api/v1/produtos?local=6gkzwgjzn820&raio=20&data=3&ordem=0&tp_comb=1"
```

*The parameters indicate the geohash (`local`), the 20 km radius (`raio`), the last 24 hours (`data=3`), and the fuel type (`tp_comb=1` for gasoline).*

## What the tool delivers

When you plot a route on the screen, the app draws the path and lists stations by price, proximity, or last update. Each entry shows the price per liter, the address, the timestamp of the last issued receipt, and direct buttons to open in Google Maps or Waze.

If the route goes outside Paraná or Pernambuco — the only states that currently open this data — the app displays a friendly reduced-coverage notice, preventing users from thinking the system is broken.

## Result and Lessons Learned

The biggest lesson from this project wasn't about code, but about **UX**. Sometimes the value of a product isn't in creating new data, but in changing how the user interacts with data that already exists. The technology was there; what was missing was the right context for someone on the road.

I got to test the tool in practice on a trip to Foz do Iguaçu during Carnival. The peace of mind of knowing exactly which city to stop at to take advantage of a R$ 0.30 per liter difference paid for every hour of development.

Try it yourself at [combustivel.bayer.ooo](https://combustivel.bayer.ooo). The project proved that with the right APIs and the right question, you can transform the anxiety of an empty tank into a clean, fast, and extremely useful interface.
