
i1 : R = QQ[x, y, z, w];

i2 : I = monomialCurveIdeal(R, {1, 2, 3})

             2                    2
o2 = ideal (z  - y*w, y*z - x*w, y  - x*z)

o2 : Ideal of R

i3 : C = res I

      1      3      2
o3 = R  <-- R  <-- R  <-- 0
                           
     0      1      2      3

o3 : ChainComplex

i4 : betti C

            0 1 2
o4 = total: 1 3 2
         0: 1 . .
         1: . 3 2

o4 : BettiTally

i5 : exit(0)
