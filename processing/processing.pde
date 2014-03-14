import java.util.Arrays;

String city; 
int fixedMax = 4974; // madrid
boolean useFixedMax = true;
boolean large = true;
String pathSuffix;
  
void setup() {
  int w;  
  
  if (large) {
    w = 3400;
    pathSuffix = "large";
  } else {
    w = 700;
    pathSuffix = "small"; 
  }
  int h = w;

  
  size(w, h);
  smooth();
  noFill();
 
  stroke(255, 0, 0);
  strokeWeight(1);
  background(#191919);
  
  city = "los-angeles";
  
  //city = "washington-dc";
  //city = "san-diego";
  //city = "manhattan";
  //city = "miami";
  //city = "san-francisco";
  //city = "madrid";
  city = "ulm";
 
  translate(50, 50);
  pushMatrix();
    /*
    drawRoute("7", #ffffff); // funicular
    drawRoute("6", #ff00ff); // gondola
    drawRoute("5", #fee0d2); // cable car
    drawRoute("4", #00ffff); // ferry
    drawRoute("3", #ff0000); // bus
    drawRoute("2", #ffff00); // rail, inter-city
    drawRoute("1", #00ff00); // subway, metro
    drawRoute("0", #0000ff); // tram
    
    */
    drawRoute("7", #f781bf); // funicular
    drawRoute("6", #a65628); // gondola
    drawRoute("5", #ffff33); // cable car
    drawRoute("4", #ff7f00); // ferry
    drawRoute("3", #e41a1c); // bus
    drawRoute("2", #984ea3); // rail, inter-city
    drawRoute("1", #4daf4a); // subway, metro
    //drawRoute("0", #377eb8); // tram
    drawRoute("0", #0000ff); // tram
  popMatrix();
  
  save("../output/" + city + "/" + city + "_" + pathSuffix + ".png"); 
}

void drawRoute(String type, color col) {
  String lines[] = loadStrings("../output/" + city + "/data_" + pathSuffix + ".lines");
  String maxmin[] = loadStrings("../output/" + city + "/maxmin_" + pathSuffix + ".lines");
  
 // if (useFixedMax) {
   // maxmin[0] = "" + fixedMax; 
  //}
 
  for (int i = 0; i < lines.length; i++) {
    String[] line = lines[i].split("\t");
    String trips =   line[0];
    if (float(trips) <= 0) trips = "1";
    String[] route_types = line[1].split(",");
    
    String[] points = line[2].split(",");

    float f = 0.2f;
    if (large) f = 0.7f;
    
    strokeWeight(log(float(trips)) * f);
    //strokeWeight(float(trips) * 0.002f);
      
    float alph = 1.0 + (float(maxmin[0]) / float(trips));
    alph = 3.0f + log(float(trips)) * 0.7f;
    //alph = 3.0f + float(trips) * 0.018f;
    
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
