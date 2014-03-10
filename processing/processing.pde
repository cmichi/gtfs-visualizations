import java.util.Arrays;
String city;

void setup() {
  size(700, 700);
  smooth();
  noFill();
 
  stroke(255, 0, 0);
  strokeWeight(1);
  background(25);
  city = "san-diego";
  city = "manhattan";
  city = "southwest-ohio";
  city = "washington";
  city = "miami";
  city = "southern-nevada";
  city = "san-francisco";
  city = "los-angeles";
  city = "amsterdam";
  city = "san-diego";
  city = "madrid";
  city = "ulm";  
  
 
  translate(50, 50);
  pushMatrix();
  
  drawRoute("3", #ff0000);
  drawRoute("0", #0000ff);
  popMatrix();
  //save("../output/" + city + "/out.png"); 
}

void drawRoute(String type, color col) {
    String lines[] = loadStrings("../output/" + city + "/data.lines");
  String maxmin[] = loadStrings("../output/" + city + "/maxmin.lines");
 
  for (int i = 0; i < lines.length; i++) {
    String[] line = lines[i].split("\t");
    String trips =   line[0];
    if (float(trips) <= 0) trips = "1";
    String[] route_types = line[1].split(",");
    //println(route_types);
    //if (Arrays.asList(route_types).contains("0"))
      //println("contains 0");
  //  if (i == 500) break;
    
    String[] points = line[2].split(",");
/*
if (!Arrays.asList(route_types).contains("0"))
  continue;
if (Arrays.asList(route_types).contains("3"))
  continue;
  */
   
      //strokeWeight(1);
      //System.out.println(float(trips) * 0.1f);
      strokeWeight(log(float(trips)) * 0.4f);
      strokeWeight(log(float(trips)) * 0.2f);
      strokeWeight(float(trips) * 0.0019f);
      
      float alph = 1.0 + (float(maxmin[0]) / float(trips));
      alph = 3.0f + log(float(trips)) * 0.7f;
      alph = 3.0f + float(trips) * 0.018f;
      stroke(0,255,0, alph + 0.0f);
      //   if (Arrays.asList(route_types).contains("0"))
      //     strokeWeight(float(trips) * 0.0041f);
      
      if (Arrays.asList(route_types).contains("3")) {
       
        stroke(col, alph);
      }

     //if (Arrays.asList(route_types).contains("0"))
     if (Arrays.asList(route_types).contains("0") && route_types.length == 1) {
      // strokeWeight(10); 
      // alph = 255.0;
        stroke(col, alph);
     }
             
     if (!Arrays.asList(route_types).contains(type) || route_types.length > 1) 
    // if (!Arrays.asList(route_types).contains(type))
       continue;
  
  
    beginShape();
    for (int n = 0; n < points.length; n++) {
      if (points[n] == "" ) continue;

      String[] coords = new String[2];
      coords = points[n].split(" ");

      if (coords.length != 2) continue;
   
     //if (Arrays.asList(route_types).contains("3") && Arrays.asList(route_types).contains("0"))
       // stroke(0, 255, 0, alph);

//if (Arrays.asList(route_types).contains("3") && route_types.length == 1)
      vertex(float(coords[0]), float(coords[1]));
      // line(float(pre[0]), float(pre[1]),  float(coords[0]), float(coords[1]) );
    }
    endShape();
  } 
}

void draw() { }
