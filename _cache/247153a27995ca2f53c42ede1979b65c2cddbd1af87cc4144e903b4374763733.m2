
i1 : kk = ZZ/32003;

i2 : R = kk[w, x, y, z]; -- this is a ring

i3 : monomialCurveIdeal(R, {1, 2, 3})

             2                    2
o3 = ideal (y  - x*z, x*y - w*z, x  - w*y)

o3 : Ideal of R

i4 : minors(2, matrix {{x, y, z}, {y, z, w}})

               2                          2
o4 = ideal (- y  + x*z, w*x - y*z, w*y - z )

o4 : Ideal of R

i5 : kernel map(kk[s,t], R, {s^3, s^2*t, s*t^2, t^3})

             2                    2
o5 = ideal (y  - x*z, x*y - w*z, x  - w*y)

o5 : Ideal of R

i6 : res oo

      1      3      2
o6 = R  <-- R  <-- R  <-- 0
                           
     0      1      2      3

o6 : ChainComplex

i7 : betti oo

            0 1 2
o7 = total: 1 3 2
         0: 1 . .
         1: . 3 2

o7 : BettiTally

i8 : exit(0)
