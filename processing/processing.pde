void setup() {
 size(600, 600);
 
 stroke(255, 0, 0);
 strokeWeight(2);
 background(255);
String lines[] = loadStrings("test.processing");
System.out.println(lines.length);
smooth();
noFill();
int u = 0;
float f = 0.4;

//translate(width/2, height/2);
//rotate(radians(90));

pushMatrix();

for (int i = 0; i < lines.length; i++) {
 String[] line = lines[i].split("\t");
 String col = "FF" +  line[0];
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
                         color col1 = color(unhex(col));
                       //  col1 = color(255, 0, 0);

stroke(col1);
                       line(float(pre[0]) * f, float(pre[1]) * f,  float(coords[0]) * f, float(coords[1]) * f);

                      
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
