export default {
meta:{day:3,prompt:"Exactly 42 lines of code",svg:false},
setup(){noFill_();},
draw({DX,DY,PI,t}){
translate_(DX,DY);
let S=360,L=5;
for(let k=0;k<L;k++){
let u=k/(L-1);
stroke_(`rgba(0,0,0,${0.10+0.05*u})`);
beginShape_();
let R=185-22*k+6*Math.sin(t+u*4);
for(let i=0;i<S;i++){
let a=i*0.07+t*0.5+u*PI*2;
let x=R*Math.sin(3*a)+28*Math.sin(a*5);
let y=R*Math.cos(4*a)+28*Math.cos(a*4);
x=8*Math.round(x/8);
y=8*Math.round(y/8);
vertex_(x,y);
}
endShape_();
}
stroke_("rgba(0,0,0,0.18)");
let cx=120*Math.sin(t*0.4),cy=120*Math.cos(t*0.35);
beginShape_();vertex_(cx-210,cy);vertex_(cx+210,cy);endShape_();
beginShape_();vertex_(cx,cy-210);vertex_(cx,cy+210);endShape_();
stroke_("rgba(0,0,0,0.10)");
beginShape_();
vertex_(-228,-228);vertex_(228,-228);vertex_(228,228);vertex_(-228,228);vertex_(-228,-228);
endShape_();
for(let p=0;p<10;p++){
let ang=p*PI/5+t*0.15;
stroke_("rgba(0,0,0,0.08)");
beginShape_();
vertex_(235*Math.sin(ang),235*Math.cos(ang));
vertex_(250*Math.sin(ang),250*Math.cos(ang));
endShape_();
}
stroke_("rgba(0,0,0,0.22)");
beginShape_();vertex_(cx-5,cy-5);vertex_(cx+5,cy+5);endShape_();
beginShape_();vertex_(cx-5,cy+5);vertex_(cx+5,cy-5);endShape_();
}
};