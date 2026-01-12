export default {
  meta: { day: 13, prompt: "Triangles and nothing else.", svg: false },

  setup() { noFill_(); },

  draw({ DX, DY, t }) {
    background_("#ffffff");
    translate_(DX, DY);

    const tri = (x1,y1,x2,y2,x3,y3) => {
      beginShape_();
      vertex_(x1,y1); vertex_(x2,y2); vertex_(x3,y3); vertex_(x1,y1);
      endShape_();
    };

    // deterministic hash (no noise())
    const hash = (a,b) => {
      const s = Math.sin(a*12.9898 + b*78.233) * 43758.5453;
      return s - Math.floor(s);
    };

    const R = 235;
    const step = 28;

    // triangle grid (alternating orientation)
    for (let y = -R; y <= R; y += step) {
      for (let x = -R; x <= R; x += step) {
        const n = hash(x*0.01, y*0.01);

        // subtle drift, makes the field breathe
        const dx = 5 * Math.sin(t*0.45 + n*6);
        const dy = 5 * Math.cos(t*0.40 + n*6);

        const up = ((Math.floor((x+R)/step) + Math.floor((y+R)/step)) % 2) === 0;

        // restrained palette through alpha only
        stroke_(`rgba(0,0,0,${0.06 + 0.12*n})`);

        if (up) {
          tri(x+dx, y+step+dy, x+step+dx, y+step+dy, x+step/2+dx, y+dy);
        } else {
          tri(x+dx, y+dy, x+step+dx, y+dy, x+step/2+dx, y+step+dy);
        }

        // occasional nested triangle (still only triangles)
        if (n > 0.86) {
          stroke_(`rgba(0,0,0,${0.10 + 0.12*(n-0.86)/0.14})`);
          const inset = step * 0.18;
          if (up) {
            tri(x+inset+dx, y+step-inset+dy, x+step-inset+dx, y+step-inset+dy, x+step/2+dx, y+inset+dy);
          } else {
            tri(x+inset+dx, y+inset+dy, x+step-inset+dx, y+inset+dy, x+step/2+dx, y+step-inset+dy);
          }
        }
      }
    }

    // frame made of triangles only
    stroke_("rgba(0,0,0,0.10)");
    const a = 235, s = 18;
    for (let i = -a; i < a; i += s) {
      tri(i, -a, i+s, -a, i+s/2, -a-10);
      tri(i,  a, i+s,  a, i+s/2,  a+10);
      tri(-a, i, -a, i+s, -a-10, i+s/2);
      tri( a, i,  a, i+s,  a+10, i+s/2);
    }
  },
};
