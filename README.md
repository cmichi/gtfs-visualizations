# GTFS Heatmap

The idea of this project is to generate nice looking "heatmaps" from
publicly available GTFS datasets. By this I mean the routes are drawn
according to their shape. The thickness and color intensity of the 
drawn lines is chosen using `log(trips_happening_on_this_shape_id)`.
All trips in the GTFS feed are counted (not just days or a week).


__Project status:__ Works!
	
	$ npm install
	$ make render gtfs=ulm

This will generate:

	./output/ulm/

	./output/ulm/data.lines

	./output/ulm/maxmin.lines	
	# containing the maximum and minimum count of trips on a shape
	# in this GTFS feed

Download [Processing 2.0](https://processing.org/download/). Then  open 
the sketch `./processing/processing.pde` within Processing.
Execute it and a file `./output/ulm/out.png` will be generated.


## Adaption to your city

Change the line `String city = "ulm";` within `./processing/processing.pde` 
to the city you want to display, e.g. `String city = "san-diego";`. 
Make sure `./gtfs/san-diego/` exists. Also make sure there is a shape file
(`./gtfs/san-diego/shapes.txt`) available! 

If you the execute the Processing sketch a file `./output/san-diego/out.png`
will be generated.


## Generating another image resolution

Within `./render.js` change

	var render_area = {width: 600, height: 600};

Within `./processing/processing.pde` change

	size(700, 700);


# License

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
