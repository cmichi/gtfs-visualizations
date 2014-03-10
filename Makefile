default: help

render:
	mkdir -p output/
	mkdir -p output/$(gtfs)/
	time node render.js --verbose --gtfs=$(gtfs) --svg=$(svg)

clean:
	rm -r ouptut/

route-types:
	cat ./gtfs/$(gtfs)/routes.txt | awk -F "\"*,\"*" '{print $$5}' | uniq

help:
	echo "Use `$ make render gtfs=ulm` to start the process."
