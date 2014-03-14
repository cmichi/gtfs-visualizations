import java.util.Arrays;
String city;

void setup() {
  int w = 700;
  //w = 3400;
  int h = w;
  
  size(w, h);
  smooth();
  noFill();
 
  stroke(255, 0, 0);
  strokeWeight(1);
  background(25);
  
  city = "manhattan";
  city = "san-diego";
  city = "san-francisco";
  city = "madrid";
  city = "los-angeles";
  city = "washington-dc";
  city = "miami";
  city = "ulm";
 
  translate(50, 50);
  pushMatrix();
    drawRoute("7", #ffffff); // funicular
    drawRoute("6", #ff00ff); // gondola
    drawRoute("5", #fee0d2); // cable car
    drawRoute("4", #00ffff); // ferry
    drawRoute("3", #ff0000); // bus
    drawRoute("2", #ffff00); // rail, inter-city
    drawRoute("1", #00ff00); // subway, metro
    drawRoute("0", #0000ff); // tram
  popMatrix();
  
  save("../output/" + city + "/" + city + "_" + w + "x" + h + ".png"); 
}

void drawRoute(String type, color col) {
  String lines[] = loadStrings("../output/" + city + "/data.lines");
  String maxmin[] = loadStrings("../output/" + city + "/maxmin.lines");
 
  for (int i = 0; i < lines.length; i++) {
    String[] line = lines[i].split("\t");
    String trips =   line[0];
    if (float(trips) <= 0) trips = "1";
    String[] route_types = line[1].split(",");
    
    String[] points = line[2].split(",");

    float f = 0.2f;
    //f = 0.6f;
    strokeWeight(log(float(trips)) * f);
    //strokeWeight(float(trips) * 0.002f);
      
    float alph = 1.0 + (float(maxmin[0]) / float(trips));
    //alph = 150.0f + log(float(trips)) * 0.7f;
    alph = 3.0f + float(trips) * 0.018f;
    
    stroke(col, alph);
    //stroke(255, 255, 255, 255);
    
    if (!Arrays.asList(route_types).contains(type) || route_types.length > 1)     
      continue;
  
    beginShape();
    for (int n = 0; n < points.length; n++) {
      if (points[n] == "" ) continue;

      String[] coords = new String[2];
      coords = points[n].split(" ");

      if (coords.length != 2) continue;
      
      vertex(float(coords[0]), float(coords[1]));
    }
    endShape();
  } 
}

void draw() { }
