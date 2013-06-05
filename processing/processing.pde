void setup() {
  size(800, 800);
 
  stroke(255, 0, 0);
  strokeWeight(1);
  background(25);
  String lines[] = loadStrings("test.processing");
  System.out.println(lines.length);
  smooth();
  noFill();
  float f = 1.7f;
  int h = 1050;

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
      // System.out.println(points[n]);
      if (pre[0] == null) {
        pre = coords;
        continue;
      }

      if (coords.length != 2 || pre.length != 2) continue;

      // System.out.println(pre[0] + " " + pre[1] + ", " + coords[0] + " " + coords[1]);

      stroke(255, 0, 0, (2093.0f/float(col)) * 20.0f);
      strokeWeight(float(col) * 0.002f);
      line(float(pre[0]) * f,h -  float(pre[1])*f,  float(coords[0])*f,h -  float(coords[1])*f);

      strokeWeight(1);
      stroke(255, 0,0, (2093.0f/float(col)) * 255.0f);
      line(float(pre[0]) * f, h - float(pre[1]) * f,  float(coords[0]) * f, h - float(coords[1]) * f);

      pre = coords;
    }
  } 
}

void draw() { }
