void setup() {
  size(700, 700);
  smooth();
  noFill();
 
  stroke(255, 0, 0);
  strokeWeight(1);
  background(25);
  String lines[] = loadStrings("../output/ulm/data.lines");
  String maxmin[] = loadStrings("../output/ulm/maxmin.lines");
  //String lines[] = loadStrings("sf-data.lines");
  //String maxmin[] = loadStrings("sf-maxmin.lines");
  
  translate(50, 50);
  pushMatrix();

  for (int i = 0; i < lines.length; i++) {
    String[] line = lines[i].split("\t");
    String trips =   line[0];
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

      /* underlying stroke */
      // sf: 2
//      stroke(255, 0, 0, (float(maxmin[0]) / float(trips)) * 2.0f);
     stroke(255, 0, 0, (float(maxmin[0]) / float(trips)) * 20.0f);
      strokeWeight(float(trips) * 0.0021f);
      //strokeWeight(2);
      line(float(pre[0]),float(pre[1]),  float(coords[0]),float(coords[1]));

      strokeWeight(1);
      //sf : 5
      //System.out.println((float(maxmin[0]) / float(trips)) * 5.0f);
      stroke(255, 0,0, (float(maxmin[0]) / float(trips)) * 255.0f);
     // stroke(255, 0,0, (float(maxmin[0]) / float(trips)) * 5.0f);
      line(float(pre[0]), float(pre[1]),  float(coords[0]), float(coords[1]) );

      pre = coords;
    }
  } 
}

void draw() { }
