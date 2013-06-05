void setup() {
  size(800, 800);
 
 stroke(255, 0, 0);
 strokeWeight(1);
 background(25);
String lines[] = loadStrings("test.processing");
System.out.println(lines.length);
smooth();
noFill();
int u = 0;
float f = 0.34;
f = 1.0f;

//translate(width/2, height/2);
//rotate(radians(90));

pushMatrix();

for (int i = 0; i < lines.length; i++) {
 String[] line = lines[i].split("\t");
 String col =   line[0];
// String col = "FF" +  line[0];
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
                         // System.out.println(pre[0] + ", " + pre[1] + ", " + coords[0] + ", " + coords[1]);
                       //  System.out.println("#" + col);
                      //   color col1 = color(unhex(col));
                       //  col1 = color(255, 0, 0);

//stroke(col1);
stroke(255, 0, 0, (2093.0f/float(col)) * 20.0f);
strokeWeight(float(col) * 0.001f);
//line(float(pre[0]) * f, float(pre[1]) * f,  float(coords[0]) * f, float(coords[1]) * f);
line(float(pre[0]), float(pre[1]),  float(coords[0]), float(coords[1]));
//System.out.println(pre[0] + " " + pre[1] + ", " + coords[0] + " " + coords[1]);
strokeWeight(1);
stroke(255, 0,0, (2093.0f/float(col)) * 255.0f);
                       line(float(pre[0]) * f, float(pre[1]) * f,  float(coords[0]) * f, float(coords[1]) * f);
//stroke(0, 255, 0, (2093.0f/float(col)) * 100.0f);
  //                     line(float(pre[0]) * f + 1, float(pre[1]) * f,  1+ float(coords[0]) * f, float(coords[1]) * f);
//stroke(0, 255, 0, (2093.0f/float(col)) * 100.0f);
  //                     line(float(pre[0]) * f, float(pre[1]) * f+ 1,   float(coords[0]) * f, 1+ float(coords[1]) * f);

                      
                        pre = coords;
                 //       return;
                }
                u++;
                //if (u == 50) return;
} 
//  background(0);
 //fill(255, 0, 0);
//ellipse(10, 10, 30, 30); 
popMatrix();
//translate(-width, 0);
}

void draw() {

}
