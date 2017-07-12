import java.util.Arrays;
import processing.pdf.*;

int MIN_TRIP_COUNT = 0;

String city; 
boolean large = true;
String pathSuffix;
String[] cities;
  
void setup() {
  /*
  cities =  new String[2];
  cities[0] = "los-angeles";
  cities[1] = "los-angeles-metro";
 
  //"los-angeles";
  //"washington-dc";
  //"san-diego";
  //"manhattan";
  //"miami";
  //"san-francisco";                  
  //"madrid";
  
  

  cities[0] = "madrid";
  cities[0] = "washington-dc";
  */
  
  cities =  new String[1];
  cities[0] = "ulm";
  
  int w;  
  
  if (large) {
    w = 3500;
    pathSuffix = "large";
  } else {
    w = 700;
    pathSuffix = "small"; 
  }
  int h = w;
  
  //size(w, h, PDF, "render.pdf");
  size(w, h);
  
  beginRecord (PDF, "../output/" + join(cities, "-") + "_" + pathSuffix + ".pdf");
  smooth();
  noFill();
 
  stroke(255, 0, 0);
  strokeWeight(1);
  background(#191919);
  
  translate(50, 50);
  pushMatrix();   
    loadLines();
    drawRoute("7", #f781bf); // funicular
    drawRoute("6", #a65628); // gondola
    drawRoute("5", #ffff33); // cable car
    drawRoute("4", #ff7f00); // ferry
    drawRoute("3", #e41a1c); // bus
    drawRoute("2", #984ea3); // rail, inter-city
    drawRoute("1", #4daf4a); // subway, metro
    drawRoute("0", #0000ff); // tram
  popMatrix();
  endRecord();
   
  //save("../output/" + join(cities, "-") + "_" + pathSuffix + ".png");
 // exit();
}

String lines[];
float[] maxmin = new float[2];
void loadLines() { 
  maxmin[0] = 0.0f;
    
  for (int i = 0; i < cities.length; i++) {
    String[] maxmin_i = loadStrings("../output/" + cities[i] + "/maxmin_" + pathSuffix + ".lines");
    if (float(maxmin_i[0]) > maxmin[0])
      maxmin[0] = float(maxmin_i[0]);
  } 
}

void drawRoute(String type, color col) {
  for (int i = 0; i < cities.length; i++) {
    BufferedReader reader;
    String inputLine;
    reader = createReader("../output/" + cities[i] + "/data_" + pathSuffix + ".lines");
    while (true) {
      try {
        inputLine = reader.readLine();
      } catch (IOException e) {
        e.printStackTrace();
        inputLine = null;
      }

      if (inputLine == null) {
         break;
      }

      String[] line = inputLine.split("\t");
      String trips = line[0];

      if (float(trips) <= MIN_TRIP_COUNT) {
        continue;
      }

      String[] route_types = line[1].split(",");
      String[] points = line[2].split(",");

      float f = 0.01f;
      if (large) f = 1.3f;
      if (large) f = 0.7f;

      float strkWeight = log(float(trips )  * f );
      if (strkWeight < 0) strkWeight = 1.0f * f;
      strokeWeight(strkWeight);

      float alph = 1.0 + (maxmin[0] / float(trips));
      alph = 15.0f + (log(float(trips)) * 4.0f);
      alph = 3.0f + (log(float(trips)) * 0.7f);

      stroke(col, alph);

      if (!Arrays.asList(route_types).contains(type) || route_types.length > 1) {
        continue;
      }

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
}

void draw() {}
