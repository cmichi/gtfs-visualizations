void setup() {
  size(700, 700);
  smooth();
  noFill();
 
  stroke(255, 0, 0);
  strokeWeight(1);
  background(25);
  String lines[] = loadStrings("data.asc");

  translate(50, 50);
  pushMatrix();

  for (int i = 0; i < lines.length; i++) {
    String[] line = lines[i].split("\t");
    String col =   line[0];
    String[] points = line[1].split(",");

    String[] pre = new String[2];
    for (int n = 0; n < points.length; n++) {
      if (points[n] == "" ) continue;

      String[] coords = new String[2];
      coords = points[n].split(" ");

      if (pre[0] == null) {
        pre = coords;
        continue;
      }

      if (coords.length != 2 || pre.length != 2) continue;

      stroke(255, 0, 0, (2093.0f/float(col)) * 20.0f);
      strokeWeight(float(col) * 0.002f);
      line(float(pre[0]),float(pre[1]),  float(coords[0]),float(coords[1]));

      strokeWeight(1);
      stroke(255, 0,0, (2093.0f/float(col)) * 255.0f);
      line(float(pre[0]), float(pre[1]),  float(coords[0]), float(coords[1]) );

      pre = coords;
    }
  } 
}

void draw() { }
