import java.util.Arrays;

void setup() {
  size(700, 700);
  smooth();
  noFill();
 
  stroke(255, 0, 0);
  strokeWeight(1);
  background(25);
  String city = "san-diego";
  //city = "manhattan";
  //city = "southwest-ohio";
  city = "washington";
  city = "ulm";
  city = "san-francisco";
  city = "madrid";
  
  String lines[] = loadStrings("../output/" + city + "/data.lines");
  String maxmin[] = loadStrings("../output/" + city + "/maxmin.lines");
  
  translate(50, 50);
  pushMatrix();

  for (int i = 0; i < lines.length; i++) {
    String[] line = lines[i].split("\t");
    String trips =   line[0];
    if (float(trips) <= 0) trips = "1";
    String[] route_types = line[1].split(",");
    String[] points = line[2].split(",");

    beginShape();
    for (int n = 0; n < points.length; n++) {
      if (points[n] == "" ) continue;

      String[] coords = new String[2];
      coords = points[n].split(" ");

      if (coords.length != 2) continue;
    
      // strokeWeight(1);
      //System.out.println(float(trips) * 0.1f);
      strokeWeight(log( float(trips)) * 0.4f);
      strokeWeight(log( float(trips)) * 0.2f);
      
      float alph = 1.0 + (float(maxmin[0]) / float(trips));
      alph = 3.0f + log( float(trips)) * 0.7f;
      stroke(0,255,0, alph + 0.0f);
      //   if (Arrays.asList(route_types).contains("0"))
      //     strokeWeight(float(trips) * 0.0041f);
      
      if (Arrays.asList(route_types).contains("3"))
        stroke(255, 0,0, alph);
        
      if (Arrays.asList(route_types).contains("3") && Arrays.asList(route_types).contains("0"))
      stroke(0,0,255, alph);

      vertex(float(coords[0]), float(coords[1]) );
      // line(float(pre[0]), float(pre[1]),  float(coords[0]), float(coords[1]) );
    }
    endShape();
  } 
  save("../output/" + city + "/out.png"); 
}

void draw() { }
