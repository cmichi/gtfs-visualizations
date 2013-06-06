default: help

render:
	mkdir -p output/
	mkdir -p output/$(gtfs)/
	node render.js --verbose --gtfs=$(gtfs) --svg=$(svg)

clean:
	rm -r ouptut/

help:
	echo "Use `$ make render gtfs=ulm` to start the process."
	
