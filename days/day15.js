export default {
  meta: { day: 15, prompt: "Design a rug.", svg: false },

  setup() {
    noStroke();
  },

  draw({ DX, DY, PI, t }) {
    background("#f3f0ea");
    translate(DX, DY);

    const W = 420, H = 520;
    const x0 = -W/2, y0 = -H/2;

    // rug palette (muted, classic)
    const P = {
      ground: "#1f2a44",   // deep indigo
      border: "#a35b3a",   // terracotta
      ivory:  "#e9e1d3",
      moss:   "#6b7b4c",
      gold:   "#c8a34a",
      ink:    "#141318"
    };

    // ---- helpers ----
    const rectP = (x,y,w,h,c)=>{ fill(c); rect(x,y,w,h); };
    const diamond = (cx,cy,w,h,c)=>{
      fill(c);
      beginShape();
      vertex(cx,cy-h/2); vertex(cx+w/2,cy); vertex(cx,cy+h/2); vertex(cx-w/2,cy);
      endShape(CLOSE);
    };
    const rosette = (cx,cy,r,c)=>{
      fill(c);
      beginShape();
      for(let i=0;i<12;i++){
        const a=i/12*PI*2;
        const rr=r*(i%2?0.65:1.0);
        vertex(cx+rr*Math.cos(a),cy+rr*Math.sin(a));
      }
      endShape(CLOSE);
    };
    const hash = (a,b)=>{ const s=Math.sin(a*12.9898+b*78.233)*43758.5453; return s-Math.floor(s); };

    // ---- outer rug body ----
    rectP(x0, y0, W, H, P.ground);

    // ---- main borders ----
    rectP(x0+16, y0+16, W-32, H-32, P.border);
    rectP(x0+34, y0+34, W-68, H-68, P.ivory);
    rectP(x0+50, y0+50, W-100, H-100, P.ground);

    // ---- corner motifs ----
    const cx1 = x0+70, cy1 = y0+70;
    const cx2 = x0+W-70, cy2 = y0+H-70;
    diamond(cx1, cy1, 44, 44, P.gold);
    diamond(cx2, cy1, 44, 44, P.gold);
    diamond(cx1, cy2, 44, 44, P.gold);
    diamond(cx2, cy2, 44, 44, P.gold);

    diamond(cx1, cy1, 26, 26, P.ground);
    diamond(cx2, cy1, 26, 26, P.ground);
    diamond(cx1, cy2, 26, 26, P.ground);
    diamond(cx2, cy2, 26, 26, P.ground);

    // ---- central medallion ----
    const mx = 0, my = 0;
    rosette(mx, my, 120, P.moss);
    rosette(mx, my, 92,  P.gold);
    rosette(mx, my, 66,  P.ivory);
    diamond(mx, my, 140, 200, "rgba(0,0,0,0.10)");
    diamond(mx, my, 90, 130,  "rgba(0,0,0,0.10)");
    rosette(mx, my, 36,  P.border);

    // ---- inner field motifs (repeat “gul” dots) ----
    for (let y = y0+95; y <= y0+H-95; y += 52) {
      for (let x = x0+95; x <= x0+W-95; x += 52) {
        const n = hash(x*0.01, y*0.01);
        if (n < 0.25) continue;

        const c = n > 0.75 ? P.gold : (n > 0.50 ? P.moss : P.ivory);
        fill(c);
        circle(x, y, 10);
        circle(x+12, y, 6);
        circle(x-12, y, 6);
        circle(x, y+12, 6);
        circle(x, y-12, 6);
      }
    }

    // ---- fringe ----
    fill(P.ivory);
    for (let i=0;i<44;i++){
      const fx = x0 + 8 + i*(W-16)/44;
      rect(fx, y0-10, 4, 10);
      rect(fx, y0+H, 4, 10);
    }

    // ---- subtle pile texture (very light, optional) ----
    // (keeps rug feeling woven; still performant)
    noStroke();
    for (let i=0;i<1200;i++){
      const px = x0 + 60 + (W-120) * hash(i, 1.1);
      const py = y0 + 60 + (H-120) * hash(i, 9.7);
      const n  = hash(px*0.02 + t*0.1, py*0.02);
      fill(n > 0.66 ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)");
      rect(px, py, 1, 1);
    }

    // ---- outline ----
    stroke(P.ink);
    noFill();
    beginShape_();
    vertex_(x0, y0); vertex_(x0+W, y0); vertex_(x0+W, y0+H); vertex_(x0, y0+H); vertex_(x0, y0);
    endShape_();
  },
};
