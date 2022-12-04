<- ["DOM"; "STYLE"; "EVENT"; "COLOR"; "LOOP"][LIBRARY];
<- ["makeuserinterface";  "insertintocontainer"; "makebutton";"makelabel";"makelist";"settextcontent";
    "setstyle";"makecontainer"] [DOM];
<- ["makestyle"; "addclass"; "unitspoint"; "fontsize";
    "backgroundcolor"; "display"; "border"; "margin"; "padding"; "unitspixel";
    "displayhide";"textcolor";"textalign";"makeclass";"makesvgstyle";"styleoption"; "cursorpointer"] [STYLE];
<- ["oninputchange";"onmouseclick";"onkeydown";"onkeyup"] [EVENT];
<- ["makergbcolor"] [COLOR];
<- ["repeat"] [LOOP];

:= [primary foreground color; make rgb color [250; 122; 123]];
:= [primary background color; make rgb color [100; 32; 11]];
:= [hover background color; make rgb color [80; 30; 9]];
:= [active background color; make rgb color [180; 130; 39]];
:= [active border color; make rgb color [110; 230; 39]];

make style [.: [".counter"; cursor pointer [];
            text color [primary foreground color];
            background color [primary background color];
            border [:: ["size"; units pixel [3]; 
                        "type"; "solid"; 
                        "color"; primary foreground color]];
            margin [:: ["top"; units pixel [10]]];
            padding [:: ["left"; units pixel [10];
                         "right"; units pixel [13];
                         "top"; units pixel [19];
                         "bottom"; units pixel [39]]]];
           .: [".counter:hover"; 
                   border [:: ["size"; units pixel [4]; 
                        "type"; "dashed"; 
                        "color"; active border color]];
            background color [hover background color]];
           .: [".counter:active"; 
            
               text color [hover background color];
            background color [active background color]]];

:= [make counter; -> [container; count;
insert into container [container;
  |> [:= [butt; make button []]; 
      make label [count];
      add class ["counter"];
      on mouse click [-> [e; 
           set text content [butt; = [count; + [count; 1]]]]]]];
]];
:= [main container; |> [make container []; 
                        set style [display ["g"];
                                     padding [
                                       :: ["left"; unitspixel[50]; 
                                           "right"; unitspixel[50]]]]]];

repeat [5; -> [make counter [main container; 0]]]