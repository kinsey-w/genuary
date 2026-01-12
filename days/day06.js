export default {
  meta: { day: 6, prompt: "Make a landscape using only primitive shapes.", svg: false },

  setup() { noFill_(); },

  draw({ DX, DY, PI, t }) {
    background_("#efe9df"); // warm paper
    translate_(DX, DY);

    // ---- primitive helpers ----
    const rect = (x,y,w,h)=>{beginShape_();vertex_(x,y);vertex_(x+w,y);vertex_(x+w,y+h);vertex_(x,y+h);vertex_(x,y);endShape_();};
    const tri  = (x1,y1,x2,y2,x3,y3)=>{beginShape_();vertex_(x1,y1);vertex_(x2,y2);vertex_(x3,y3);vertex_(x1,y1);endShape_();};
    const circ = (cx,cy,r,n=48)=>{beginShape_();for(let i=0;i<=n;i++){let a=i/n*PI*2;vertex_(cx+r*Math.cos(a),cy+r*Math.sin(a));}endShape_();};

    // ---- sky ----
    stroke_("#c7d3dd");
    rect(-240,-240,480,160);
    stroke_("#b8c7b0");
    rect(-240,-80,480,110);

    // ---- sun ----
    const sx=-120+10*Math.sin(t*0.15);
    const sy=-150+6*Math.cos(t*0.12);
    stroke_("#e1b56f");
    circ(sx,sy,26,60);
    stroke_("#e1b56f66");
    circ(sx,sy,44,70);

    // ---- mountains ----
    const m=8*Math.sin(t*0.25);
    stroke_("#8b7f73");
    tri(-240,20,-120,-120+m,0,20);
    tri(-40,30,100,-140-m,240,30);

    stroke_("#a59a8f");
    tri(-180,30,-60,-90-m,60,30);
    tri(40,40,150,-80+m,260,40);

    // ---- hills ----
    stroke_("#7f9a7a");
    for(let i=0;i<10;i++){
      const x=-240+i*55;
      const y=70+6*Math.sin(t*0.35+i);
      circ(x,y,70,40);
    }

    // ---- water ----
    stroke_("#6f8fa3");
    rect(-240,90,480,150);

    stroke_("#ffffff33");
    for(let r=0;r<9;r++){
      const y=110+r*14+3*Math.sin(t*0.6+r*0.8);
      const w=380-r*18;
      rect(-w/2,y,w,2);
    }

    // ---- trees ----
    for(let i=0;i<9;i++){
      const x=-210+i*52;
      const sway=4*Math.sin(t*0.8+i*0.7);

      stroke_("#5b4a3a");           // trunk
      rect(x+sway,70,6,18);

      stroke_("#3f6b4f");           // foliage
      tri(x-10+sway,70,x+3+sway,40,x+16+sway,70);
      tri(x-8+sway,58,x+3+sway,32,x+14+sway,58);
    }

    // ---- foreground stones ----
    stroke_("#9a938b");
    for(let i=0;i<8;i++){
      const x=-210+i*60+10*Math.sin(t*0.4+i);
      const y=210+4*Math.cos(t*0.5+i*0.9);
      circ(x,y,10+(i%3)*3,28);
    }

    // ---- frame ----
    stroke_("#00000022");
    beginShape_();
    vertex_(-235,-235);vertex_(235,-235);vertex_(235,235);vertex_(-235,235);vertex_(-235,-235);
    endShape_();
  },
};
