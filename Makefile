default: help

render:
	# would be better to check if the dir already exists
	mkdir -p output/
	mkdir -p output/$(gtfs)/
	node render.js --verbose --gtfs=$(gtfs) --svg=$(svg)

clean:
	rm -r ouptut/

help:
	echo "Use `$ make render gtfs=ulm` to start the process."
	
