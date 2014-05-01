# GTFS Visualizations

The idea of this project is to generate beautiful and informative
visualizations from publicly available GTFS datasets. By this I 
mean the routes are drawn according to their shape. The thickness 
and color intensity of the drawn lines is chosen using 
`log(trips_happening_on_this_shape_id)`. All trips in the GTFS 
feed are counted (not just days or a week).

__Project status:__ Works! You will find information on how to generate
a visualization for a custom GTFS feed below the gallery: 
[How to generate a visualization](#how-to-generate-a-visualization).

__Known problems:__ The GTFS parser currently loads the GTFS in memory.
This means large GTFS feeds will cause problems, if your machine does
not provide sufficient RAM.

	
## Gallery

The colors currenltly used are:

	tram                    #0000ff	blue
	subway, metro           #00ff00	green
	rail, inter-city        #ffff00 yellow
	bus                     #ff0000 red
	ferry                   #00ffff cyan
	cable car               #fee0d2 ocker
	gondola                 #ff00ff purple
	funicular               #ffffff white

### Ulm

[![Ulm GTFS Heatmap](https://github.com/cmichi/gtfs-visualizations/raw/master/gallery/small/ulm.png)](https://github.com/cmichi/gtfs-visualizations/raw/master/gallery/large/ulm.png)

Rendering based on an inofficial GTFS feed. There is an official one
available, though it does (not yet?) include shapes.

Download: 
[PNG (0.4 MB)](https://raw.githubusercontent.com/cmichi/gtfs-visualizations/master/gallery/large/ulm.png)
[PDF (0.12 MB)](https://raw.githubusercontent.com/cmichi/gtfs-visualizations/master/gallery/pdf/ulm.pdf)

### Madrid

[![Madrid GTFS Heatmap](https://github.com/cmichi/gtfs-visualizations/raw/master/gallery/small/madrid.png)](https://github.com/cmichi/gtfs-visualizations/raw/master/gallery/large/madrid.png)

Rendering based on the [official feed](http://www.gtfs-data-exchange.com/agency/madrid/) 
by the Empresa Municipal de Transportes. (March 12, 2014)

Download: 
[PNG (1.4 MB)](https://raw.githubusercontent.com/cmichi/gtfs-visualizations/master/gallery/large/madrid.png)
[PDF (0.4 MB)](https://raw.githubusercontent.com/cmichi/gtfs-visualizations/master/gallery/pdf/madrid.pdf)

### San Diego

[![San Diego GTFS Heatmap](https://github.com/cmichi/gtfs-visualizations/raw/master/gallery/small/san-diego.png)](https://github.com/cmichi/gtfs-visualizations/raw/master/gallery/large/san-diego.png)

Rendering based on the [official feed](http://www.sdmts.com/Planning/Developers.asp) 
by the Metropolitan Transit System (MTS). (March 12, 2014)

Download: 
[PNG (0.5 MB)](https://raw.githubusercontent.com/cmichi/gtfs-visualizations/master/gallery/large/san-diego.png)
[PDF (0.6 MB)](https://raw.githubusercontent.com/cmichi/gtfs-visualizations/master/gallery/pdf/san-diego.pdf)

### Los-Angeles

[![Los Angeles GTFS Heatmap](https://github.com/cmichi/gtfs-visualizations/raw/master/gallery/small/los-angeles.png)](https://github.com/cmichi/gtfs-visualizations/raw/master/gallery/large/los-angeles.png)

Rendering based on the [official feed](http://www.gtfs-data-exchange.com/agency/la-metro/) 
by the Los Angeles County Metropolitan Transportation Authority. (March 14, 2014)

Download: 
[PNG (0.9 MB)](https://raw.githubusercontent.com/cmichi/gtfs-visualizations/master/gallery/large/los-angeles.png)

### San Francisco

[![San Francisco GTFS Heatmap](https://github.com/cmichi/gtfs-visualizations/raw/master/gallery/small/san-francisco.png)](https://github.com/cmichi/gtfs-visualizations/raw/master/gallery/large/san-francisco.png)

Rendering based on the [official feed](http://www.gtfs-data-exchange.com/agency/san-francisco-municipal-transportation-agency/) 
by the San Francisco Municipal Transportation Agency. (March 12, 2014)

Download: 
[PNG (1 MB)](https://raw.githubusercontent.com/cmichi/gtfs-visualizations/master/gallery/large/san-francisco.png)
[PDF (1.1 MB)](https://raw.githubusercontent.com/cmichi/gtfs-visualizations/master/gallery/pdf/san-francisco.pdf)

### Washington DC

[![Washington GTFS Heatmap](https://github.com/cmichi/gtfs-visualizations/raw/master/gallery/small/washington-dc.png)](https://github.com/cmichi/gtfs-visualizations/raw/master/gallery/large/washington-dc.png)

Rendering based on the [official feed](http://www.gtfs-data-exchange.com/agency/dc-circulator/) 
by DC Circulator. (March 13, 2014)

Download: 
[PNG (1.2 MB)](https://raw.githubusercontent.com/cmichi/gtfs-visualizations/master/gallery/large/washington-dc.png)

### Miami

[![Miami GTFS Heatmap](https://github.com/cmichi/gtfs-visualizations/raw/master/gallery/small/miami.png)](https://github.com/cmichi/gtfs-visualizations/raw/master/gallery/large/miami.png)

Rendering based on the [official feed](http://www.gtfs-data-exchange.com/agency/miami-dade-transit/) 
by the Miami Dade Transit. (March 13, 2014)

Download: 
[PNG (0.3 MB)](https://raw.githubusercontent.com/cmichi/gtfs-visualizations/master/gallery/large/miami.png)
[PDF (0.12 MB)](https://raw.githubusercontent.com/cmichi/gtfs-visualizations/master/gallery/pdf/miami.pdf)


## Posters

I think the visualizations look quite beautiful and have started to 
compile a series of A0 posters. Click on the preview image to open
the PDF. The templates can be found in `./posters/`.

[![Multiple Feeds](https://github.com/cmichi/gtfs-visualizations/raw/master/posters/4up-poster-thumb.jpg)](https://github.com/cmichi/gtfs-visualizations/raw/master/posters/4up-poster.jpg) [![One Feed, Fullscreen](https://github.com/cmichi/gtfs-visualizations/raw/master/posters/madrid-poster-thumb.jpg)](https://github.com/cmichi/gtfs-visualizations/raw/master/posters/madrid-poster.jpg)

Click on the images to get a larger preview.

The posters can be downloaded here:

 * [Madrid (PDF, 11 MB)](http://media.micha.elmueller.net/projects/gtfs/madrid-poster.pdf)
 * [Madrid, Ulm, Washington, San Diego (PDF, 81 MB)](http://media.micha.elmueller.net/projects/gtfs/4up-poster.pdf)


## How to generate a visualization

Download and install [node.js and npm](http://nodejs.org/).

	$ git clone https://github.com/cmichi/gtfs-visualizations.git
	$ cd gtfs-visualizations/
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
Execute it and a file `./output/ulm.png` will be generated.


### Adaption to your city

Change those lines within `./processing/processing.pde` :

	cities =  new String[1];
	cities[0] = "ulm";

to the city you want to display, e.g. `cities[1] = "san-diego";`. 
Make sure `./gtfs/san-diego/` exists. Also make sure there is a shape file
(`./gtfs/san-diego/shapes.txt`) available! 

Execute `$ make render gtfs=san-diego` and after this is finished the 
Processing sketch `./processing/processing.pde`. You will then find your
visualization generated in `./output/san-diego.png`.

For certain cities (e.g. Los Angeles) multiple separate GTFS feeds 
are available (e.g. bus, metro, etc.). To render multiple GTFS feeds into
the visualization you can adapt the cities array:

	cities =  new String[2];
	cities[0] = "los-angeles";
	cities[1] = "los-angeles-metro";


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

 * The green and red color combination should be done better (persons with 
   red/green disabilities might have problems). Use other color scheme.

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
