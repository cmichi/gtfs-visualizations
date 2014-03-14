# GTFS Heatmap

The idea of this project is to generate nice looking "heatmaps" from
publicly available GTFS datasets. By this I mean the routes are drawn
according to their shape. The thickness and color intensity of the 
drawn lines is chosen using `log(trips_happening_on_this_shape_id)`.
All trips in the GTFS feed are counted (not just days or a week).

__Project status:__ Works! You will find information on how to generate
a visualization for a custom GTFS feed below the gallery: 
[How to generate a visualization](#how-to-generate-a-visualization).

__Known problems:__ The GTFS parser currently loads the GTFS in memory.
This means large GTFS feeds will cause problems, if your machine does
not provide sufficient RAM.

	
## Gallery

### Ulm

[![Ulm GTFS Heatmap](https://github.com/cmichi/gtfs-heatmap/raw/master/gallery/ulm.png)](https://github.com/cmichi/gtfs-heatmap/raw/master/gallery/ulm.png)

Rendering based on an inofficial GTFS feed. There is an official one
available, though it does (not yet?) include shapes.

### Madrid

[![Madrid GTFS Heatmap](https://github.com/cmichi/gtfs-heatmap/raw/master/gallery/madrid.png)](https://github.com/cmichi/gtfs-heatmap/raw/master/gallery/madrid.png)

Rendering based on the [official feed](http://www.gtfs-data-exchange.com/agency/madrid/) 
by the Empresa Municipal de Transportes. (March 12, 2014)

### San Diego

[![San Diego GTFS Heatmap](https://github.com/cmichi/gtfs-heatmap/raw/master/gallery/san-diego.png)](https://github.com/cmichi/gtfs-heatmap/raw/master/gallery/san-diego.png)

Rendering based on the [official feed](http://www.sdmts.com/Planning/Developers.asp) 
by the Metropolitan Transit System (MTS). (March 12, 2014)

### Los-Angeles

[![Los Angeles GTFS Heatmap](https://github.com/cmichi/gtfs-heatmap/raw/master/gallery/los-angeles.png)](https://github.com/cmichi/gtfs-heatmap/raw/master/gallery/los-angeles.png)

Rendering based on the [official feed](http://www.gtfs-data-exchange.com/agency/la-metro/) 
by the Los Angeles County Metropolitan Transportation Authority. (March 14, 2014)

### San Francisco

[![San Francisco GTFS Heatmap](https://github.com/cmichi/gtfs-heatmap/raw/master/gallery/san-francisco.png)](https://github.com/cmichi/gtfs-heatmap/raw/master/gallery/san-francisco.png)

Rendering based on the [official feed](http://www.gtfs-data-exchange.com/agency/san-francisco-municipal-transportation-agency/) 
by the San Francisco Municipal Transportation Agency. (March 12, 2014)

### Washington DC

[![Washington GTFS Heatmap](https://github.com/cmichi/gtfs-heatmap/raw/master/gallery/washington-dc.png)](https://github.com/cmichi/gtfs-heatmap/raw/master/gallery/washington-dc.png)

Rendering based on the [official feed](http://www.gtfs-data-exchange.com/agency/dc-circulator/) 
by DC Circulator. (March 13, 2014)

### Miami

[![Miami GTFS Heatmap](https://github.com/cmichi/gtfs-heatmap/raw/master/gallery/miami.png)](https://github.com/cmichi/gtfs-heatmap/raw/master/gallery/miami.png)

Rendering based on the [official feed](http://www.gtfs-data-exchange.com/agency/miami-dade-transit/) 
by the Miami Dade Transit. (March 13, 2014)


## How to generate a visualization

Download and install [node.js and npm](http://nodejs.org/).

	$ git clone https://github.com/cmichi/gtfs-heatmap.git
	$ cd gtfs-heatmap/
	$ npm install
	$ make render gtfs=ulm

Based on the GTFS files in `./gtfs/ulm/` this will generate:

	./output/ulm/

	./output/ulm/data.lines

	./output/ulm/maxmin.lines	
	# containing the maximum and minimum count of trips on a shape
	# in this GTFS feed

Download [Processing 2.0](https://processing.org/download/). Then open 
the sketch `./processing/processing.pde` within Processing.
Execute it and a file `./output/ulm/out.png` will be generated.


### Adaption to your city

Change the line `String city = "ulm";` within `./processing/processing.pde` 
to the city you want to display, e.g. `String city = "san-diego";`. 
Make sure `./gtfs/san-diego/` exists. Also make sure there is a shape file
(`./gtfs/san-diego/shapes.txt`) available! 

Execute `$ make render gtfs=san-diego` and after this is finished the 
Processing sketch `./processing/processing.pde`. You will then find your
visualization generated in `./output/san-diego/out.png`.


### Generating other image resolutions

Within `./render.js` change

	var render_area = {width: 600, height: 600};

Within `./processing/processing.pde` change

	size(700, 700);


### Colors

See the sketch `./processing/processing.pde` and search this block:

	drawRoute("7", #ffffff); // funicular
	drawRoute("6", #ffffff); // gondola
	drawRoute("5", #ffffff); // cable car
	drawRoute("4", #ffffff); // ferry
	drawRoute("3", #ff0000); // bus
	drawRoute("2", #ffffff); // rail, inter-city
	drawRoute("1", #ffffff); // subway, metro
	drawRoute("0", #0000ff); // tram

These are the default colors used. You are free to adapt them.


## Nice to have ToDos

 * For certain cities (e.g. Los Angeles) multiple separate GTFS feeds 
   are available (e.g. bus, metro, etc.). It would be nice if the 
   heatmap could be generated from multiple GTFS feeds.

 * GTFS provides a field `route_color`. Supporting this would be nice.
   Colors right now are hardcoded.


## License

### Gallery

	The gallery photos are licensed under the Creative Commons Attribution
	4.0 International license: http://creativecommons.org/licenses/by/4.0/.

### Code

	Copyright (c) 2013-2014

		Michael Mueller <http://micha.elmueller.net/>

	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
