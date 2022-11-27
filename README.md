# chip

Build wep-apps that can be stored inside a link and shared for free.
;; this is a comment
; separator
1 2 3 4 5 6 7 8 9 0 3.14 ;; numbers
"Hello World!" ;; strings
0 ;; false
1 ;; true
void ;; not defined
:= [x; 10] ;; definition
= [x; 5] ;; assigment
.. [:=[x]; = [x; 5]] ;; block
.: [1; 2; 3] ;; array
:: ["x"; 10; "y"; 20] ;; object
. [obj; "x"] ;; get key
.= [obj; "x"; 10] ;; set key
.!= [obj; "x"] ;; delete key
|| [1; 0] ;; OR
&& [1; 0] ;; AND

> [10; 9] ;; greather
> < [9; 10] ;; lesser
> == [1; 1] ;; equal
> != [1; 2] ;; not equal
> = [10; 10] ;; greather or equal
> <= [9; 10] ;; lesser or equal
> ? [> [1; 2]; 1; 2] ;; if else
> ?? [void; 0] ;; nullish coalescing
> ! [0] ;; not

- [1; 2] ;; add

* [2; 1] ;; substract

- [2; 3] ;; multiply
  : [9; 3] ;; devision
  % [10; 2] ;; remainder of devision
  -> [x; \* [x; 2]] ;; function definition
  <- ["isodd"] [LOGIC] ;; import
  |> [.: [1; 2; 3]; map [square]; filter [is odd]] ;; pipe
  ... [.: [1; 2; 3]; .: [4; 5; 6]]; ;; spread
  ~= [loop; -> [x; ? [> [x; 0]; loop[- [x; 1]]]]] ;; recursion

#

@
.:=
.:!=

> - > <<
>   > .
>   > .<<
>   > \_
>   > \_<
>   > <>
>   > <><
>   > |.|
>   > |:|
>   > =>
>   > .=>
>   > .\*
>   > .>
>   > .<
