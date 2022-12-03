import { equal, deepEqual, throws } from 'assert'
import { runFromInterpreted } from '../language/misc/utils.js'
describe('interpretation should work as expected', () => {
  it('definitions', () => {
    deepEqual(
      runFromInterpreted(
        `:= [x; 10]; := [y; 3]; := [temp; x]; = [x; y]; = [y; temp]; :: ["x"; x; "y"; y]`
      ),
      { x: 3, y: 10 }
    )
    throws(() => runFromInterpreted(`: [29; 0]`), RangeError)
  })
  it('types', () => {
    deepEqual(
      runFromInterpreted(`
      <- ["CONVERT"] [LIBRARY];
  <- ["boolean"] [CONVERT];

  := [type of; -> [entity; ? [== [entity; void]; void; . [entity; "constructor"; "name"]]]];

  >> [.: [0; "0"; boolean [0]; :: ["0"; 0]; .: [0]; -> [0]; void]; -> [x; i; a; .= [a; i; type of [x]]]];
      `),
      ['Number', 'String', 'Boolean', 'Object', 'Array', 'Function', void 0]
    )
  })
  it('simple math', () => {
    equal(
      runFromInterpreted(
        `:= [x; 30]; := [result; + [: [* [+ [1; 2; 3]; 2]; % [4; 3]]; x]];`
      ),
      42
    )
    throws(() => runFromInterpreted(`: [29; 0]`), RangeError)
  })

  it('if', () => {
    equal(
      runFromInterpreted(
        `:= [age; 18];
   ? [>= [age; 18]; "Can work!"; "Can't work"];
      `
      ),
      'Can work!'
    )
    deepEqual(
      runFromInterpreted(`
          := [validate age; -> [age; ? [>= [age; 18]; ~ ["Can work"; ? [>=[age; 21]; " and can drink"; ""]]; "Can't work and can't drink"]]];
          .: [validate age [18]; validate age [21]; validate age [12]];
      `),
      ['Can work', 'Can work and can drink', "Can't work and can't drink"]
    )
  })

  it('switch case', () => {
    deepEqual(
      runFromInterpreted(`
       := [switch case; -> [matcher;
            ?? [
            . [:: [
              "knock knock"; -> [..["who's there"]];
              "meaning of life"; -> [..[42]];
              ;; add more cases here
              ;; ...
            ]; matcher];
              ;; default case
            -> ["nothing matched"]
          ][]]];
          .: [switch case ["meaning of life"]; switch case [0]; switch case  ["knock knock"]];
      `),
      [42, 'nothing matched', "who's there"]
    )
  })

  it('fib sum', () => {
    equal(
      runFromInterpreted(`;; calculating fib sequance
          := [fib; -> [n; ? [
            > [n; 0];
               ? [== [n; 1]; 1;
                ? [== [n; 2]; 1;
                  + [fib [- [n; 1]]; fib [- [n; 2]]]]]; n]]];
                fib[10]
                  `),
      55
    )
  })

  it('max sub array sum rec', () => {
    equal(
      runFromInterpreted(`;; max_sub_array_recursive
      <- ["MATH"] [LIBRARY];
      <- ["max"; "infinity"] [MATH];
      ~= [loop; -> [i; nums; maxGlobal; maxSoFar;
          ? [< [i; .:? [nums]]; .. [
          = [maxGlobal; max [maxGlobal; = [maxSoFar; max [0; + [maxSoFar; . [nums; i]]]]]];
          loop [= [i; + [i; 1]]; nums; maxGlobal; maxSoFar]];
          maxGlobal]]]
      [0; .: [1; -2; 10; -5; 12; 3; -2; 3; -199; 10]; * [infinity; -1]; * [infinity; -1]]`),
      21
    )
  })
  it('sum median', () => {
    equal(
      runFromInterpreted(`
  <- ["MATH"; "ARRAY"] [LIBRARY];
  <- ["sum"] [MATH];
  <- ["range"] [ARRAY];

  := [NUMBERS; range [1; 100]];
  := [first; . [NUMBERS; 0]];
  := [last; . [NUMBERS; - [.:? [NUMBERS]; 1]]];
  := [median; + [first;
  - [* [last; * [+ [1; last]; 0.5]];
      * [first; * [+ [1; first]; 0.5]]]]];
  == [sum [NUMBERS]; median]
      `),
      1
    )
  })

  it('sum tree nodes', () => {
    equal(
      runFromInterpreted(`;; sum_tree_nodes
      := [node; -> [value; left; right;
        :: ["value"; value;
            "left"; left;
            "right"; right]]];

      := [sum; -> [item;
        ? [== [item; void];
          0;
          + [. [item; "value"];
             sum [. [item; "left"]];
             sum [. [item; "right"]]]]]];

      := [myTree;
        node [1;
          node [2;
            node [4; void; void];
            node [6; void; void]];
        node [3;
          node [5; void; void];
          node [7; void; void]]]];
          sum [myTree]
      `),
      28
    )
  })

  it('length of string', () => {
    equal(runFromInterpreted(`. ["01010"; "length"];`), 5)
  })

  it('* import should work', () => {
    deepEqual(
      runFromInterpreted(`<- ["MATH"; "ARRAY"] [LIBRARY];
      <- ["*"] [ARRAY];
      <- ["*"] [MATH];
      map [.: [1.123; 3.14; 4.9]; floor];
      `),
      [1, 3, 4]
    )
  })

  it('nested pipes should work', () => {
    equal(
      runFromInterpreted(`
        |> [
          10;
          call [-> [x; * [x; 3]]];
          call [-> [x; * [x; 10]]]
        ]`),
      300
    )
  })
  it('>> and << should work', () => {
    deepEqual(
      runFromInterpreted(`
        := [out; .: []];
        >> [.: [1; 2; 3; 4]; -> [x; i; a; .= [out; i; * [x; 10]]]];
        << [.: [10; 20; 30]; -> [x; i; a;.= [out; i; - [. [out; i]; * [x; 0.1]]]]];
        >> [out; -> [x; i; a; .= [out; i; + [x; i]]]];
        out;
      `),
      [9, 19, 29, 43]
    )

    deepEqual(
      runFromInterpreted(`
      |> [
        .: [1; 2; 3; 4];
        >> [-> [x; i; a; .= [a; i; * [x; 10]]]];
        << [-> [x; i; a; .= [a; i; - [. [a; i]; * [x; 0.1]]]]];
        >> [-> [x; i; a; .= [a; i; + [x; i]]]];
        << [-> [x; i; a; .= [a; i; + [. [a; i]; i; 1]]]];
      ]
      `),
      [10, 21, 32, 43]
    )
  })
})
