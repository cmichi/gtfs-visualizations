default: datafile

datafile:
	node render.js

clean:
	rm output.svg
	rm processing/data.lines
	rm processing/maxmin.lines
