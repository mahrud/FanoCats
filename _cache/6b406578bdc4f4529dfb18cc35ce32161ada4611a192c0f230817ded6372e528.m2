
i1 : S = QQ[x_0..x_20];

i2 : G = Grassmannian(2, 5, S)

o2 = ideal (x  x   - x  x   + x  x  , x x   - x x   + x x  , x  x   - x  x   + x  x  , x  x   - x  x   + x  x  , x  x   - x  x   + x  x  , x x   - x x   + x x  , x x   - x x   + x x  , x x   - x x   + x x  , x x   - x x   + x x   - x x  , x x   - x x   + x x  , x  x   - x  x   + x  x  , x x   - x x   + x x  , x x   - x x   + x x  , x x   - x x   + x x   + x x  , x x   - x x   + x x  , x x   - x x   + x x  , x x   - x x   + x x  , x x   - x x   + x x   + x x   - x x   + x x  , x x   - x x   + x x  , x x   - x x   + x x   + x x  , x x   - x x   + x x  , x x   - x x   + x x  , x x   - x x   + x x  , x x   - x x   + x x   - x x  , x x   - x x   + x x  , x x   - x x   + x x  , x x   - x x   + x x  , x x   - x x   + x x  , x x   - x x   + x x  , x x   - x x   + x x  , x x  - x x  + x x , x x  - x x  + x x , x x  - x x  + x x , x x  - x x  + x x , x x  - x x  + x x )
             15 17    14 18    12 19   9 17    8 18    6 19   15 16    13 18    11 19   14 16    13 17    10 19   12 16    11 17    10 18   9 16    7 18    5 19   8 16    7 17    4 19   6 16    5 17    4 18   3 16    2 17    1 18    0 19   9 14    8 15    3 19   12 13    11 14    10 15   9 13    7 15    2 19   8 13    7 14    1 19   6 13    5 14    4 15    0 19   3 13    2 14    1 15   9 12    6 15    3 18   8 12    6 14    3 17   7 12    5 14    4 15    2 17    1 18    0 19   9 11    5 15    2 18   8 11    5 14    2 17    0 19   7 11    5 13    2 16   6 11    5 12    0 18   3 11    2 12    0 15   9 10    4 15    1 18    0 19   8 10    4 14    1 17   7 10    4 13    1 16   6 10    4 12    0 17   5 10    4 11    0 16   3 10    1 12    0 14   2 10    1 11    0 13   6 7    5 8    4 9   3 7    2 8    1 9   3 5    2 6    0 9   3 4    1 6    0 8   2 4    1 5    0 7

o2 : Ideal of S

i3 : P = ideal(x_8..x_20);

o3 : Ideal of S

i4 : Q = ideal(x_0*x_7 + x_1*x_6 + x_2*x_5 + x_3*x_4);

o4 : Ideal of S

i5 : I = G + P + Q;

o5 : Ideal of S

i6 : X = Proj(S/I);

i7 : dim X

o7 = 3

i8 : degree X

o8 = 10

i9 : exit(0)
