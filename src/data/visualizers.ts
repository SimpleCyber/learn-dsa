export interface VizStep {
  a: number[];
  p?: Record<string, number>;
  hi?: number[];
  range?: [number, number];
  stack?: number[];
  note: string;
}

export interface VizItem {
  title: string;
  f: () => VizStep[];
}

export const VIZ: Record<string, VizItem> = {
  "3:0": {
    title: "Pair sum on a sorted array, target 14",
    f() {
      const a = [1, 3, 4, 6, 8, 11], T = 14, f: VizStep[] = [];
      let l = 0, r = 5;
      while (l < r) {
        const s = a[l] + a[r];
        f.push({
          a,
          p: { l, r },
          hi: [l, r],
          note: `${a[l]} + ${a[r]} = ${s}${s === T ? ' = target. Found!' : s < T ? ' < ' + T + ', too small, move l right' : ' > ' + T + ', too big, move r left'}`
        });
        if (s === T) break;
        s < T ? l++ : r--;
      }
      return f;
    }
  },
  "3:3": {
    title: "Fixed window of size 3, track the best sum",
    f() {
      const a = [2, 1, 5, 1, 3, 2], k = 3, f: VizStep[] = [];
      let s = 0, b = 0;
      for (let i = 0; i < a.length; i++) {
        s += a[i];
        if (i >= k) s -= a[i - k];
        if (i >= k - 1) b = Math.max(b, s);
        f.push({
          a,
          p: { r: i },
          range: [Math.max(0, i - k + 1), i],
          note: i < k - 1 ? `building the first window, sum = ${s}` : `add ${a[i]}, drop ${i >= k ? a[i - k] : 'nothing'}: window sum = ${s}, best = ${b}`
        });
      }
      return f;
    }
  },
  "6:0": {
    title: "Binary search for 11",
    f() {
      const a = [1, 3, 5, 7, 9, 11, 13], T = 11, f: VizStep[] = [];
      let lo = 0, hi = 6;
      while (lo <= hi) {
        const m = (lo + hi) >> 1;
        f.push({
          a,
          p: { lo, hi, mid: m },
          hi: [m],
          range: [lo, hi],
          note: `mid = ${m} -> ${a[m]} ${a[m] === T ? '= target. Found!' : a[m] < T ? '< ' + T + ', so lo = mid + 1' : '> ' + T + ', so hi = mid - 1'}`
        });
        if (a[m] === T) break;
        a[m] < T ? lo = m + 1 : hi = m - 1;
      }
      return f;
    }
  },
  "1:3": {
    title: "Kadane on [-2,1,-3,4,-1,2]",
    f() {
      const a = [-2, 1, -3, 4, -1, 2], f: VizStep[] = [];
      let c = 0, b = -1e9;
      a.forEach((x, i) => {
        c = Math.max(x, c + x);
        b = Math.max(b, c);
        f.push({
          a,
          p: { i },
          hi: [i],
          note: `x = ${x}: cur = max(${x}, previous + ${x}) = ${c}, best = ${b}`
        });
      });
      return f;
    }
  },
  "4:2": {
    title: "Daily Temperatures with a monotonic stack",
    f() {
      const a = [73, 74, 75, 71, 69, 72, 76], f: VizStep[] = [], st: number[] = [];
      a.forEach((x, i) => {
        const po: number[] = [];
        while (st.length && x > a[st[st.length - 1]]) po.push(st.pop()!);
        st.push(i);
        f.push({
          a,
          p: { i },
          hi: [i],
          stack: st.map(j => a[j]),
          note: po.length ? `${x} pops ${po.map(j => a[j]).join(', ')}; they waited ${po.map(j => i - j).join(', ')} day(s)` : `${x} is pushed, nothing smaller on top to pop`
        });
      });
      return f;
    }
  }
};
